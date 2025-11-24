import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useCreateUser, useUpdateUser } from "../hooks/useUserQueries";
import { Spinner } from "@/components/ui/spinner";
import type { User, CreateUserDto, UpdateUserDto } from "../types";

const userFormSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres").max(40, "Máximo 40 caracteres"),
  userName: z.string().min(4, "Mínimo 4 caracteres").max(10, "Máximo 10 caracteres"),
  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/,
      "Debe contener mayúscula, número y carácter especial"
    )
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email inválido").max(100, "Máximo 100 caracteres"),
  role: z.enum(["admin", "normal"]),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  user,
}: CreateUserDialogProps) {
  const isEditing = !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "normal",
    },
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setValue("fullName", user.fullName);
      setValue("userName", user.userName);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("password", "");
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = async (data: UserFormValues) => {
    if (isEditing) {
      const updatePayload: UpdateUserDto = {
        fullName: data.fullName,
        userName: data.userName,
        email: data.email,
        role: data.role,
      };

      updateMutation.mutate(
        { id: user.id, data: updatePayload },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      const createPayload: CreateUserDto = {
        fullName: data.fullName,
        userName: data.userName,
        email: data.email,
        role: data.role,
        password: data.password || "",
      };

      createMutation.mutate(createPayload, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del usuario"
              : "Completa los datos del nuevo usuario"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Juan Pérez"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Usuario *</Label>
              <Input
                id="userName"
                {...register("userName")}
                placeholder="jperez"
              />
              {errors.userName && (
                <p className="text-xs text-destructive">{errors.userName.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="usuario@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {!isEditing && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Contraseña123!"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Debe contener al menos una mayúscula, un número y un carácter
                  especial (@#$%^&+=!)
                </p>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="role">Rol *</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Usuario Normal</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Los administradores tienen acceso completo al sistema
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
                "Crear Usuario"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
