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
      <div className="min-h-dvh flex items-center justify-center">
        //Poner un spinner de carga
      </div>
    );
  if (error) return <div>Error al cargar el perfil</div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex animate-fade-in">
      <NavigationMenu />

      <main className="flex-1 ml-16 lg:ml-64 p-3 sm:p-4 lg:p-6 animate-slide-up transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
