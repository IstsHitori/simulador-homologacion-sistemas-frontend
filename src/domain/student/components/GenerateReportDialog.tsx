import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlans } from "@/domain/plan/hooks/usePlanQueries";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Search, FileText } from "lucide-react";
import type { GenerateReportResponse } from "../types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { generatePublicReport } from "../services/student.service";
import { generateHomologationPDF } from "@/shared/utils/pdfGenerator";

const studentFormSchema = z.object({
  identification: z.string().min(1, "La identificación es requerida").max(11),
  email: z.string().email("Email inválido").max(100),
  names: z.string().min(1, "Los nombres son requeridos").max(40),
  lastNames: z.string().min(1, "Los apellidos son requeridos").max(40),
  semester: z.number().min(1).max(10),
  cityResidence: z.string().min(1, "La ciudad es requerida").max(20),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface GenerateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportDialog({
  open,
  onOpenChange,
}: GenerateReportDialogProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [reportResult, setReportResult] =
    useState<GenerateReportResponse | null>(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      semester: 1,
      gender: "Masculino",
    },
  });

  const { data: plans, isLoading: plansLoading } = usePlans();

  const generateMutation = useMutation({
    mutationFn: generatePublicReport,
    onSuccess: (result) => {
      setReportResult(result);
      setCurrentStep(3);
      toast.success(result.message || "Reporte generado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al generar el reporte");
    },
  });

  const selectedGender = watch("gender");
  const selectedSemester = watch("semester");

  const handleNextStep = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep(2);
    }
  }, [trigger]);

  const handleClose = useCallback(() => {
    setCurrentStep(1);
    setReportResult(null);
    setSelectedSubjects([]);
    reset();
    onOpenChange(false);
  }, [reset, onOpenChange]);

  const onSubmit = useCallback(
    async (data: StudentFormValues) => {
      const payload = {
        studentData: data,
        approvedSubjects: selectedSubjects.map((id) => ({
          approvedSubjectVersionId: id,
        })),
      };

      generateMutation.mutate(payload);
    },
    [selectedSubjects, generateMutation]
  );

  const handleGenerateReport = useCallback(async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Debes seleccionar al menos una materia aprobada");
      return;
    }
    // Mostrar alert de confirmación
    setShowConfirmAlert(true);
  }, [selectedSubjects.length]);

  const handleConfirmGenerate = useCallback(() => {
    setShowConfirmAlert(false);
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const handleSubjectToggle = useCallback((subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  }, []);

  const handlePrintPDF = useCallback(() => {
    if (!reportResult) return;

    generateHomologationPDF({
      message: reportResult.message,
      student: {
        identification: reportResult.student.identification,
        email: reportResult.student.email,
        names: reportResult.student.names,
        lastNames: reportResult.student.lastNames,
        semester: reportResult.student.semester,
        cityResidence: reportResult.student.cityResidence,
        gender: reportResult.student.gender,
      },
      subjectsToHomologate: reportResult.subjectsToHomologate,
      subjectsToView: reportResult.subjectsToView,
    });
  }, [reportResult]);

  const oldPlanSubjects = useMemo(
    () => plans?.oldPlan?.subjects || [],
    [plans?.oldPlan?.subjects]
  );

  const filteredSubjects = useMemo(
    () =>
      oldPlanSubjects.filter((subject) => {
        const matchesSearch =
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea =
          filterArea === "all" || subject.area.name === filterArea;
        const matchesSemester =
          filterSemester === "all" ||
          subject.semester.toString() === filterSemester;
        return matchesSearch && matchesArea && matchesSemester;
      }),
    [oldPlanSubjects, searchTerm, filterArea, filterSemester]
  );

  const uniqueAreas = useMemo(
    () => Array.from(new Set(oldPlanSubjects.map((s) => s.area.name))),
    [oldPlanSubjects]
  );

  if (currentStep === 3 && reportResult) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Reporte de Homologación Generado
            </DialogTitle>
            <DialogDescription>
              Revisa tu reporte de homologación y descárgalo en PDF
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información del Estudiante */}
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2">
              <h3 className="font-semibold text-base sm:text-lg">
                Información del Estudiante
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-muted-foreground">Identificación:</span>
                  <p className="font-medium wrap-break-word">
                    {reportResult.student.identification}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium wrap-break-word">
                    {reportResult.student.email}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nombres:</span>
                  <p className="font-medium wrap-break-word">
                    {reportResult.student.names}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Apellidos:</span>
                  <p className="font-medium wrap-break-word">
                    {reportResult.student.lastNames}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Semestre:</span>
                  <p className="font-medium">{reportResult.student.semester}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ciudad:</span>
                  <p className="font-medium wrap-break-word">
                    {reportResult.student.cityResidence}
                  </p>
                </div>
              </div>
            </div>

            {/* Materias a Homologar */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs sm:text-sm">
                  {reportResult.subjectsToHomologate.length}
                </span>
                <span className="text-sm sm:text-base">
                  Materias a Homologar
                </span>
              </h3>
              <ScrollArea className="h-[200px] border rounded-lg p-3 sm:p-4">
                {reportResult.subjectsToHomologate.length === 0 ? (
                  <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
                    No hay materias para homologar
                  </p>
                ) : (
                  <div className="space-y-2">
                    {reportResult.subjectsToHomologate.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="font-medium text-xs sm:text-sm wrap-break-word">
                          {subject.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Semestre {subject.semester} - {subject.credits}{" "}
                          créditos
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Materias Faltantes por Ver */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">
                  {reportResult.subjectsToView.length}
                </span>
                Materias Faltantes por Ver
              </h3>
              <ScrollArea className="h-[200px] border rounded-lg p-4">
                {reportResult.subjectsToView.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    ¡No hay materias faltantes!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {reportResult.subjectsToView.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Semestre {subject.semester} - {subject.credits}{" "}
                          créditos
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
            <Button onClick={handlePrintPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Imprimir Reporte PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header fijo */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">
              Generar Reporte de Homologación
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm mt-1">
              {currentStep === 1
                ? "Paso 1 de 2: Completa tus datos personales"
                : "Paso 2 de 2: Selecciona las materias que aprobaste en tu plan anterior"}
            </DialogDescription>
            <div className="flex items-center gap-2 mt-3">
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  currentStep >= 1 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  currentStep >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-hidden flex flex-col min-h-0"
        >
          {currentStep === 1 && (
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="identification"
                      className="text-sm sm:text-base"
                    >
                      Identificación <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="identification"
                      {...register("identification")}
                      placeholder="Ej: 1234567890"
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                    {errors.identification && (
                      <p className="text-sm text-destructive">
                        {errors.identification.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="ejemplo@correo.com"
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="names" className="text-sm sm:text-base">
                      Nombres <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="names"
                      {...register("names")}
                      placeholder="Nombres completos"
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                    {errors.names && (
                      <p className="text-sm text-destructive">
                        {errors.names.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lastNames" className="text-sm sm:text-base">
                      Apellidos <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastNames"
                      {...register("lastNames")}
                      placeholder="Apellidos completos"
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                    {errors.lastNames && (
                      <p className="text-sm text-destructive">
                        {errors.lastNames.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="semester" className="text-sm sm:text-base">
                      Semestre <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={selectedSemester?.toString()}
                      onValueChange={(value) =>
                        setValue("semester", parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Semestre" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semestre {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.semester && (
                      <p className="text-sm text-destructive">
                        {errors.semester.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label
                      htmlFor="cityResidence"
                      className="text-sm sm:text-base"
                    >
                      Ciudad de Residencia{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cityResidence"
                      {...register("cityResidence")}
                      placeholder="Ej: Valledupar"
                      className="h-10 sm:h-11 text-sm sm:text-base"
                    />
                    {errors.cityResidence && (
                      <p className="text-sm text-destructive">
                        {errors.cityResidence.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 sm:col-span-2">
                    <Label htmlFor="gender" className="text-sm sm:text-base">
                      Género <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={selectedGender}
                      onValueChange={(value) =>
                        setValue(
                          "gender",
                          value as "Masculino" | "Femenino" | "Otro"
                        )
                      }
                    >
                      <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Selecciona el género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Femenino">Femenino</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-destructive">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          {currentStep === 2 && (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Filtros fijos */}
              <div className="px-4 sm:px-6 py-4 space-y-2 sm:space-y-3 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar materia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 text-sm h-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterArea} onValueChange={setFilterArea}>
                    <SelectTrigger className="flex-1 text-sm h-9">
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las áreas</SelectItem>
                      {uniqueAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterSemester}
                    onValueChange={setFilterSemester}
                  >
                    <SelectTrigger className="flex-1 text-sm h-9">
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semestre {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <p className="text-muted-foreground">
                    {selectedSubjects.length} de {oldPlanSubjects.length}{" "}
                    materias seleccionadas
                  </p>
                </div>
              </div>

              {/* Lista de materias con scroll */}
              {plansLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="px-4 sm:px-6 pb-4 space-y-2">
                    {filteredSubjects.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No se encontraron materias
                      </p>
                    ) : (
                      filteredSubjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors active:bg-accent block"
                        >
                          <Checkbox
                            checked={selectedSubjects.includes(subject.id)}
                            onCheckedChange={() =>
                              handleSubjectToggle(subject.id)
                            }
                            className="mt-0.5 sm:mt-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base leading-tight">
                              {subject.name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                              {subject.code && subject.code !== "N/A"
                                ? `${subject.code} - `
                                : ""}
                              Sem. {subject.semester} - {subject.credits}{" "}
                              créd.
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {subject.area.name}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {/* Footer fijo con botones */}
          <div className="flex justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t shrink-0 bg-background">
            {currentStep === 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="text-sm h-10 sm:h-11 flex-1 sm:flex-none"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="text-sm h-10 sm:h-11 flex-1 sm:flex-none"
                >
                  Siguiente
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="text-sm h-10 sm:h-11 flex-1 sm:flex-none"
                >
                  Atrás
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={generateMutation.isPending}
                  className="text-sm h-10 sm:h-11 flex-1 sm:flex-none"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      Generando...
                    </>
                  ) : (
                    "Generar Reporte"
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>

      {/* Alert Dialog de Confirmación */}
      <AlertDialog open={showConfirmAlert} onOpenChange={setShowConfirmAlert}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Confirmar Generación de Reporte
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 pt-2">
                <div className="text-base font-medium text-foreground">
                  ⚠️ Información Importante
                </div>
                <div>
                  Revisa cuidadosamente tu información personal y las materias
                  seleccionadas.
                </div>
                <div className="text-destructive font-medium">
                  Una vez generado el reporte, NO podrás editar tu información.
                </div>
                <div className="text-sm">
                  Si necesitas hacer cambios posteriormente, deberás contactar
                  al administrador del sistema.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel>Cancelar y Revisar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate}>
              Confirmar y Generar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
