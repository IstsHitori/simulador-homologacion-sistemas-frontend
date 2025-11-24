import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/domain/auth/stores/auth.store";
import { AccessDenied } from ".";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const profile = useAuthStore((state) => state.profile);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const userRole = profile?.role?.toLowerCase();
  const hasPermission = !allowedRoles || allowedRoles.length === 0 || 
    allowedRoles.some((role) => role.toLowerCase() === userRole);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no tiene permiso, mostrar página de acceso denegado
  if (!hasPermission) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
