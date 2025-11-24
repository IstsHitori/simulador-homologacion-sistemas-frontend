import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/domain/auth/services/auth.service";
import useAuth from "@/domain/auth/hooks/useAuth";
import { useEffect } from "react";
import { NavigationMenu } from "../components";

export default function PrivateLayout() {
  const { isAuthenticated, setProfile } = useAuth();
  const navigate = useNavigate();
  const { data, isFetching, isSuccess, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    staleTime: 0, // Siempre considerar los datos obsoletos para refetch
  });


  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (data && isSuccess) setProfile(data);
  }, [data, isSuccess, setProfile]);

  if (isFetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 to-accent/5">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-accent/30 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground/80">Cargando perfil...</p>
            <p className="text-xs text-muted-foreground">Por favor espera un momento</p>
          </div>
        </div>
      </div>
    );

    
  if (error) return <div>Error al cargar el perfil</div>;
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex animate-fade-in">
      <NavigationMenu />

      <main className="flex-1 ml-0 lg:ml-72 p-3 sm:p-4 lg:p-6 animate-slide-up transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
