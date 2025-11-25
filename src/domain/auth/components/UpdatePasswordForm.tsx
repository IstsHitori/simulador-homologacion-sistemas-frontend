import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/config/axios";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Requisitos de seguridad para la contraseña
const PASSWORD_REQUIREMENTS = {
  minLength: 6,
  maxLength: 20,
  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/,
};

const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "La contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(
        PASSWORD_REQUIREMENTS.minLength,
        `Mínimo ${PASSWORD_REQUIREMENTS.minLength} caracteres`
      )
      .max(
        PASSWORD_REQUIREMENTS.maxLength,
        `Máximo ${PASSWORD_REQUIREMENTS.maxLength} caracteres`
      )
      .regex(
        PASSWORD_REQUIREMENTS.pattern,
        "Debe contener al menos: una mayúscula, un número y un carácter especial (@#$%^&+=!)"
      ),
    confirmPassword: z
      .string()
      .min(1, "Debe confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.currentPassword !== data.newPassword,
    {
      message: "La nueva contraseña no puede ser igual a la actual",
      path: ["newPassword"],
    }
  );

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

// Función para verificar requisitos de la contraseña
function checkPasswordRequirements(password: string) {
  return {
    hasMinLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasMaxLength: password.length <= PASSWORD_REQUIREMENTS.maxLength,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@#$%^&+=!]/.test(password),
  };
}

export function UpdatePasswordForm() {
  const [newPasswordValue, setNewPasswordValue] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onBlur",
  });

  const passwordReqs = checkPasswordRequirements(newPasswordValue);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdatePasswordValues) => {
      const response = await axiosPrivate.patch(`/auth/update-password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      reset();
      setNewPasswordValue("");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(message || "Error al actualizar la contraseña");
    },
  });

  const onSubmit = (data: UpdatePasswordValues) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="font-semibold">
          Contraseña Actual *
        </Label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          placeholder="••••••••"
          disabled={updateMutation.isPending}
          className="focus:ring-2 focus:ring-primary/50"
        />
        {errors.currentPassword && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="font-semibold">
          Nueva Contraseña *
        </Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword", {
            onChange: (e) => setNewPasswordValue(e.target.value),
          })}
          placeholder="••••••••"
          disabled={updateMutation.isPending}
          className="focus:ring-2 focus:ring-primary/50"
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.newPassword.message}
          </p>
        )}

        {/* Requisitos de seguridad */}
        {newPasswordValue && (
          <div className="mt-3 p-3 bg-muted rounded-lg space-y-2">
            <p className="text-xs font-semibold text-foreground">
              Requisitos de seguridad:
            </p>
            <div className="space-y-1 text-xs">
              <div
                className={`flex items-center gap-2 ${
                  passwordReqs.hasMinLength
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {passwordReqs.hasMinLength ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Al menos {PASSWORD_REQUIREMENTS.minLength} caracteres
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordReqs.hasMaxLength
                    ? "text-green-600 dark:text-green-400"
                    : "text-destructive"
                }`}
              >
                {passwordReqs.hasMaxLength ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Máximo {PASSWORD_REQUIREMENTS.maxLength} caracteres
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordReqs.hasUppercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {passwordReqs.hasUppercase ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Una mayúscula (A-Z)
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordReqs.hasNumber
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {passwordReqs.hasNumber ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Un número (0-9)
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordReqs.hasSpecialChar
                    ? "text-green-600 dark:text-green-400"
                    : "text-muted-foreground"
                }`}
              >
                {passwordReqs.hasSpecialChar ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                Un carácter especial (@#$%^&+=!)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-semibold">
          Confirmar Nueva Contraseña *
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          disabled={updateMutation.isPending}
          className="focus:ring-2 focus:ring-primary/50"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setNewPasswordValue("");
          }}
          disabled={updateMutation.isPending}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="gap-2"
        >
          {updateMutation.isPending ? (
            <>
              <Spinner className="h-4 w-4" />
              Actualizando...
            </>
          ) : (
            "Cambiar Contraseña"
          )}
        </Button>
      </div>
    </form>
  );
}
