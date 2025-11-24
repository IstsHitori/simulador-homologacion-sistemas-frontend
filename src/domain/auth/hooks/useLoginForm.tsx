import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginDataSchema, type LoginPayload } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAuth } from "../services/auth.service";
import { toast } from "sonner";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

export default function useLoginForm() {
  const defaultValues: LoginPayload = {
    userName: "",
    password: "",
  };
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //React hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    resolver: zodResolver(loginDataSchema),
  });

  //Tanstack query
  const { mutate, isPending } = useMutation({
    mutationFn: loginAuth,
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "Cerrar",
          onClick: () => console.log(),
        },
      });
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data || "");
      setIsAuthenticated(true);

      // Limpiar todo el cache de queries para evitar datos del usuario anterior
      queryClient.clear();

      // Forzar refetch del perfil con el nuevo token
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      navigate("/app/home");
    },
  });

  return {
    register,
    handleSubmit,
    mutate,
    errors,
    isPending,
  };
}
