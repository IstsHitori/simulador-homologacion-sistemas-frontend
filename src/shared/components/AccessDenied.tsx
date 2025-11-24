import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes los permisos necesarios para acceder a este módulo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            El módulo de <strong>Administración</strong> está disponible únicamente para usuarios con rol de <strong>Administrador</strong>.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Si crees que deberías tener acceso, por favor contacta con el administrador del sistema.
          </p>
          <Button 
            className="w-full" 
            onClick={() => navigate("/app/home")}
          >
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
