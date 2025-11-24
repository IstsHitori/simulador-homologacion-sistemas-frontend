import { useEffect, useState } from "react";
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
import { useCreateStudent, useUpdateStudent } from "../hooks/useStudentQueries";
import { usePlans } from "@/domain/plan/hooks/usePlanQueries";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import type { Student, CreateStudentResponse } from "../types";
import { toast } from "sonner";

const studentFormSchema = z.object({
  identification: z.string().min(1, "La identificación es requerida").max(11),
  email: z.string().email("Email inválido").max(100),
  names: z.string().min(1, "Los nombres son requeridos").max(40),
  lastNames: z.string().min(1, "Los apellidos son requeridos").max(40),
  semester: z.number().min(1).max(5),
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
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
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

  const selectedGender = watch("gender");
  const selectedSemester = watch("semester");

  useEffect(() => {
    if (student) {
      setValue("identification", student.identification);
      setValue("email", student.email);
      setValue("names", student.names);
      setValue("lastNames", student.lastNames);
      setValue("semester", student.semester);
      setValue("cityResidence", student.cityResidence);
      setValue("address", student.address);
      setValue("telephone", student.telephone);
      setValue("gender", student.gender);
      setSelectedSubjects(student.approvedSubjects?.map((s) => s.id) || []);
    } else {
      reset();
      setSelectedSubjects([]);
    }
  }, [student, setValue, reset]);

  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const onSubmit = async (data: StudentFormValues) => {
    if (!isEditing && selectedSubjects.length === 0) {
      toast.error("Debes seleccionar al menos una materia aprobada");
      return;
    }

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
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (result) => {
          reset();
          setSelectedSubjects([]);
          if (onSuccess) {
            onSuccess(result);
          }
        },
      });
    }
  };

  const oldPlanSubjects = plans?.oldPlan?.subjects || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Editar Estudiante" : "Nuevo Estudiante"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del estudiante"
              : "Completa los datos y selecciona las materias aprobadas"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-4">
              {/* Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="identification">Identificación *</Label>
                    <Input
                      id="identification"
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
                      value={selectedGender}
                      onValueChange={(value) =>
                        setValue("gender", value as "Masculino" | "Femenino" | "Otro")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      value={selectedSemester?.toString()}
                      onValueChange={(value) =>
                        setValue("semester", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((sem) => (
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

              {/* Materias Aprobadas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Materias Aprobadas (Plan Actual)
                </h3>
                {plansLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto bg-muted/30">
                    {oldPlanSubjects.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        No hay materias disponibles
                      </p>
                    ) : (
                      oldPlanSubjects.map((subject) => (
                        <div
                          key={subject.id}
                          className="flex items-center space-x-3 p-3 hover:bg-background rounded-md transition-smooth"
                        >
                          <Checkbox
                            id={`subject-${subject.id}`}
                            checked={selectedSubjects.includes(subject.id)}
                            onCheckedChange={() => handleSubjectToggle(subject.id)}
                          />
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium">{subject.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Semestre {subject.semester} • {subject.credits} créditos •{" "}
                              {subject.area.name}
                            </div>
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedSubjects.length} materia(s) seleccionada(s)
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
