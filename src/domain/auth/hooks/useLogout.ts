import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const logout = () => {
    // Limpiar token y store
    logoutStore();
    
    // Invalidar todas las queries para limpiar cache
    queryClient.clear();
    
    // Redirigir al login
    navigate("/");
  };

  return logout;
};
