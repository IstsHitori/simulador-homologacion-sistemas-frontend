import { useEffect, useState, useMemo, useCallback } from "react";
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
import {
  useCreateStudent,
  useUpdateStudent,
  useStudent,
} from "../hooks/useStudentQueries";
import { usePlans } from "@/domain/plan/hooks/usePlanQueries";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import type { Student, CreateStudentResponse } from "../types";
import { toast } from "sonner";

const studentFormSchema = z.object({
  identification: z.string().min(1, "La identificación es requerida").max(11),
  email: z.string().email("Email inválido").max(100),
  names: z.string().min(1, "Los nombres son requeridos").max(40),
  lastNames: z.string().min(1, "Los apellidos son requeridos").max(40),
  semester: z.number().min(1).max(10),
  cityResidence: z.string().min(1, "La ciudad es requerida").max(20),
  address: z.string().min(1, "La dirección es requerida").max(20),
  telephone: z.string().min(1, "El teléfono es requerido").max(10),
  gender: z.enum(["Masculino", "Femenino", "Otro"]),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSuccess?: (result: CreateStudentResponse) => void;
}

export function CreateStudentDialog({
  open,
  onOpenChange,
  student,
  onSuccess,
}: CreateStudentDialogProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      semester: 1,
      gender: "Masculino",
    },
  });

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: studentDetails, isLoading: studentLoading } = useStudent(
    isEditing ? student?.id : ""
  );

  const selectedGender = watch("gender");
  const selectedSemester = watch("semester");

  const handleNextStep = useCallback(async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep(2);
    }
  }, [trigger]);

  // Consolidar lógica: reset, cargar datos, y paso inicial
  useEffect(() => {
    if (!open) return;

    setCurrentStep(1);
    clearErrors(); // Limpiar errores del formulario

    if (isEditing && studentDetails) {
      // Cargar datos del estudiante
      setValue("identification", studentDetails.identification);
      setValue("email", studentDetails.email);
      setValue("names", studentDetails.names);
      setValue("lastNames", studentDetails.lastNames);
      setValue("semester", studentDetails.semester);
      setValue("cityResidence", studentDetails.cityResidence);
      setValue("address", studentDetails.address);
      setValue("telephone", studentDetails.telephone);
      setValue("gender", studentDetails.gender);
      setSelectedSubjects(
        studentDetails.approvedSubjects?.map((s) => s.id) || []
      );
    } else if (!isEditing) {
      reset();
      setSelectedSubjects([]);
    }
  }, [open, isEditing, studentDetails, student, setValue, reset, clearErrors]);

  // Función para crear/actualizar estudiante
  const onSubmit = useCallback(
    async (data: StudentFormValues) => {
      const payload = {
        studentData: data,
        approvedSubjects: selectedSubjects.map((id) => ({
          approvedSubjectVersionId: id,
        })),
      };

      if (isEditing) {
        updateMutation.mutate(
          { id: student.id, data: payload },
          {
            onSuccess: (result) => {
              onOpenChange(false);
              reset();
              if (onSuccess) {
                onSuccess(result);
              }
            },
          }
        );
      } else {
        createMutation.mutate(payload, {
          onSuccess: (result) => {
            reset();
            setSelectedSubjects([]);
            setCurrentStep(1);
            if (onSuccess) {
              onSuccess(result);
            }
          },
        });
      }
    },
    [
      selectedSubjects,
      isEditing,
      student,
      updateMutation,
      createMutation,
      onOpenChange,
      reset,
      onSuccess,
    ]
  );

  const handleCreateOrUpdate = useCallback(async () => {
    // Validar materias antes de crear
    if (!isEditing && selectedSubjects.length === 0) {
      toast.error("Debes seleccionar al menos una materia aprobada");
      return;
    }
    // Ejecutar submit del formulario
    handleSubmit(onSubmit)();
  }, [isEditing, selectedSubjects.length, handleSubmit, onSubmit]);

  const handleSubjectToggle = useCallback((subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  }, []);

  const oldPlanSubjects = useMemo(
    () => plans?.oldPlan?.subjects || [],
    [plans?.oldPlan?.subjects]
  );

  // Memoizar filtrado de materias
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

  // Memoizar áreas únicas
  const uniqueAreas = useMemo(
    () => Array.from(new Set(oldPlanSubjects.map((s) => s.area.name))),
    [oldPlanSubjects]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-6xl ${
          currentStep === 2 && "min-w-6xl"
        }  h-[90vh] overflow-hidden flex flex-col`}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Editar Estudiante" : "Nuevo Estudiante"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? "Paso 1 de 2: Completa los datos personales del estudiante"
              : "Paso 2 de 2: Selecciona las materias aprobadas del plan actual"}
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-hidden flex flex-col"
        >
          {isEditing && studentLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4 min-h-0">
              <div className="space-y-6 pb-6">
                {/* Paso 1: Datos Personales */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      Datos Personales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="identification">Identificación *</Label>
                        <Input
                          id="identification"
                          type="number"
                          {...register("identification")}
                          placeholder="1234567890"
                        />
                        {errors.identification && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.identification.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="estudiante@example.com"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="names">Nombres *</Label>
                        <Input
                          id="names"
                          {...register("names")}
                          placeholder="Juan Carlos"
                        />
                        {errors.names && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.names.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastNames">Apellidos *</Label>
                        <Input
                          id="lastNames"
                          {...register("lastNames")}
                          placeholder="Pérez García"
                        />
                        {errors.lastNames && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.lastNames.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="gender">Género *</Label>
                        <Select
                          value={selectedGender || ""}
                          onValueChange={(value) =>
                            setValue(
                              "gender",
                              value as "Masculino" | "Femenino" | "Otro"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un género" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="semester">Semestre *</Label>
                        <Select
                          value={selectedSemester?.toString() || ""}
                          onValueChange={(value) =>
                            setValue("semester", parseInt(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un semestre" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                              <SelectItem key={sem} value={sem.toString()}>
                                Semestre {sem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="cityResidence">Ciudad *</Label>
                        <Input
                          id="cityResidence"
                          {...register("cityResidence")}
                          placeholder="Bogotá"
                        />
                        {errors.cityResidence && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.cityResidence.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="address">Dirección *</Label>
                        <Input
                          id="address"
                          {...register("address")}
                          placeholder="Calle 10 #20-30"
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.address.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="telephone">Teléfono *</Label>
                        <Input
                          id="telephone"
                          type="number"
                          {...register("telephone")}
                          placeholder="3001234567"
                        />
                        {errors.telephone && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.telephone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 2: Materias Aprobadas */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-primary">
                        Materias Aprobadas (Plan Actual)
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {selectedSubjects.length} seleccionada(s)
                      </span>
                    </div>

                    {plansLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        {/* Filtros */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar materia..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9 h-9"
                            />
                          </div>
                          <div>
                            <Select
                              value={filterArea}
                              onValueChange={setFilterArea}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Área" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todas las áreas
                                </SelectItem>
                                {uniqueAreas.map((area) => (
                                  <SelectItem key={area} value={area}>
                                    {area}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Select
                              value={filterSemester}
                              onValueChange={setFilterSemester}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Semestre" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  Todos los semestres
                                </SelectItem>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                                  <SelectItem key={sem} value={sem.toString()}>
                                    Semestre {sem}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Tabla de materias */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="max-h-[450px] overflow-y-auto">
                            <table className="w-full">
                              <thead className="bg-muted/50 sticky top-0 z-10">
                                <tr className="border-b">
                                  <th className="w-12 p-3"></th>
                                  <th className="text-left p-3 font-semibold text-sm">
                                    Materia
                                  </th>
                                  <th className="text-left p-3 font-semibold text-sm">
                                    Código
                                  </th>
                                  <th className="text-center p-3 font-semibold text-sm">
                                    Semestre
                                  </th>
                                  <th className="text-center p-3 font-semibold text-sm">
                                    Créditos
                                  </th>
                                  <th className="text-left p-3 font-semibold text-sm">
                                    Área
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredSubjects.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="text-center py-8 text-muted-foreground text-sm"
                                    >
                                      No se encontraron materias
                                    </td>
                                  </tr>
                                ) : (
                                  filteredSubjects.map((subject, index) => (
                                    <tr
                                      key={subject.id}
                                      className={`border-b hover:bg-muted/30 transition-colors ${
                                        index % 2 === 0
                                          ? "bg-background"
                                          : "bg-muted/10"
                                      }`}
                                    >
                                      <td className="p-3 text-center">
                                        <Checkbox
                                          checked={selectedSubjects.includes(
                                            subject.id
                                          )}
                                          onCheckedChange={() =>
                                            handleSubjectToggle(subject.id)
                                          }
                                        />
                                      </td>
                                      <td className="p-3 font-medium text-sm">
                                        {subject.name}
                                      </td>
                                      <td className="p-3 text-sm text-muted-foreground">
                                        {subject.code || "N/A"}
                                      </td>
                                      <td className="p-3 text-center text-sm">
                                        {subject.semester}
                                      </td>
                                      <td className="p-3 text-center text-sm">
                                        {subject.credits}
                                      </td>
                                      <td className="p-3 text-sm text-muted-foreground">
                                        {subject.area.name}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-between gap-3 pt-4 border-t">
            <div>
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setCurrentStep(1);
                }}
              >
                Cancelar
              </Button>
              {currentStep === 1 ? (
                <Button type="button" onClick={handleNextStep}>
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleCreateOrUpdate}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" />
                      {isEditing ? "Actualizando..." : "Creando..."}
                    </>
                  ) : isEditing ? (
                    "Actualizar"
                  ) : (
                    "Crear Estudiante"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
