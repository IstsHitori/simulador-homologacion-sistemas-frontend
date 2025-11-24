import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { SubmitHandler } from "react-hook-form";
import useLoginForm from "../hooks/useLoginForm";
import type { LoginPayload } from "../types";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginForm() {
  const { handleSubmit, register, mutate, errors, isPending } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginPayload> = async (loginData) => {
    mutate(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Simulador de homologación de estudiantes de sistemas
          </CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingrese su usuario"
                required
                {...register("userName", {
                  required: "Por favor ingrese el nombre de usuario",
                })}
              />
              {errors.userName?.message}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  required
                  className="pr-10"
                  {...register("password", {
                    required: "Por favor ingrese la contraseña",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            }
            <Link
              to="recuperar-contraseña"
              className="block w-full text-center text-sm text-primary hover:underline transition-colors mt-2 font-medium"
            >
              Recuperar mi contraseña
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
