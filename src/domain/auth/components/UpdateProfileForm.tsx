import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../services/auth.service";
import { toast } from "sonner";

const updateProfileSchema = z.object({
  fullName: z.string().min(3, "Mínimo 3 caracteres").max(40, "Máximo 40 caracteres"),
  userName: z.string().min(4, "Mínimo 4 caracteres").max(10, "Máximo 10 caracteres"),
});

type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export function UpdateProfileForm() {
  const { profile, setProfile } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      userName: profile.userName,
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      setProfile({ ...profile, ...data });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error 
        ? error.message
        : "Error al actualizar el perfil";
      toast.error(message);
    },
  });

  const onSubmit = (data: UpdateProfileValues) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="flex justify-end gap-3 pt-4">
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
            "Actualizar Perfil"
          )}
        </Button>
      </div>
    </form>
  );
}
