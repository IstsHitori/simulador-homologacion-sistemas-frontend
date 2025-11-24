import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { axiosPrivate } from "@/config/axios";
import { toast } from "sonner";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Mínimo 6 caracteres"),
  newPassword: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/,
      "Debe contener mayúscula, número y carácter especial"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function UpdatePasswordForm() {
  const { profile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await axiosPrivate.patch(`/user/${profile.id}/password`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      reset();
    },
    onError: (error: unknown) => {
      const message = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : undefined;
      toast.error(message || "Error al actualizar la contraseña");
    },
  });

  const onSubmit = (data: UpdatePasswordValues) => {
    updateMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Contraseña Actual *</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          placeholder="••••••••"
        />
        {errors.currentPassword && (
          <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva Contraseña *</Label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          placeholder="••••••••"
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Debe contener al menos una mayúscula, un número y un carácter especial (@#$%^&+=!)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña *</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
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
