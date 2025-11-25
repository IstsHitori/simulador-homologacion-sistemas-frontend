import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/config/axios";
import { toast } from "sonner";

const PASSWORD_REQUIREMENTS = {
  minLength: 6,
  maxLength: 20,
  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/,
};

const updateUserPasswordSchema = z
  .object({
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
        "Debe contener: mayúscula, número y carácter especial (@#$%^&+=!)"
      ),
    confirmPassword: z
      .string()
      .min(1, "Debe confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type UpdateUserPasswordValues = z.infer<typeof updateUserPasswordSchema>;

function checkPasswordRequirements(password: string) {
  return {
    hasMinLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasMaxLength: password.length <= PASSWORD_REQUIREMENTS.maxLength,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@#$%^&+=!]/.test(password),
  };
}

interface UpdateUserPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  onSuccess?: () => void;
}

export function UpdateUserPasswordDialog({
  open,
  onOpenChange,
  userId,
  userName,
  onSuccess,
}: UpdateUserPasswordDialogProps) {
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserPasswordValues>({
    resolver: zodResolver(updateUserPasswordSchema),
    mode: "onBlur",
  });

  const passwordReqs = checkPasswordRequirements(newPasswordValue);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUserPasswordValues) => {
      const response = await axiosPrivate.patch(
        `/user/update-password/${userId}`,
        {
          newPassword: data.newPassword,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(`Contraseña de ${userName} actualizada correctamente`);
      reset();
      setNewPasswordValue("");
      onOpenChange(false);
      onSuccess?.();
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

  const onSubmit = (data: UpdateUserPasswordValues) => {
    updateMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false) {
      reset();
      setNewPasswordValue("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Contraseña</DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para {userName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nueva Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="font-semibold">
              Nueva Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  onChange: (e) => setNewPasswordValue(e.target.value),
                })}
                placeholder="••••••••"
                disabled={updateMutation.isPending}
                className="pr-10 focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={updateMutation.isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
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
                  Requisitos:
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
                    {PASSWORD_REQUIREMENTS.minLength}+ caracteres
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
                    Una mayúscula
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
                    Un número
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
                    Carácter especial
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-semibold">
              Confirmar Nueva Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                disabled={updateMutation.isPending}
                className="pr-10 focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={updateMutation.isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateMutation.isPending}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Actualizando...
                </>
              ) : (
                "Actualizar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
