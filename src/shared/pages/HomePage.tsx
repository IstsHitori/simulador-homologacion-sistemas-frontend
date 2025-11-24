import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react";
import useAuth from "@/domain/auth/hooks/useAuth";
import { useStudents } from "@/domain/student/hooks/useStudentQueries";
import { useUsers } from "@/domain/user/hooks/useUserQueries";
import { Badge } from "@/components/ui/badge";

export function HomePage() {
  const { profile } = useAuth();
  const { data: students } = useStudents();
  const { data: users } = useUsers();

  const stats = [
    {
      title: "Estudiantes Registrados",
      value: students?.length || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Usuarios del Sistema",
      value: users?.length || 0,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      adminOnly: true,
    },
    {
      title: "Planes Disponibles",
      value: 2,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
          >
            <GraduationCap className="h-8 w-8 text-primary" />
          </motion.div>
          Bienvenido, {profile.fullName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Simulador de Homologación de Estudiantes - Universidad Popular Del Cesar
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="mt-2">
            {profile.role === "admin" ? "Administrador" : "Usuario Normal"}
          </Badge>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats
          .filter((stat) => !stat.adminOnly || profile.role === "admin")
          .map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  className="shadow-sm hover:shadow-lg transition-all border-l-4 h-full"
                  style={{ borderLeftColor: stat.color }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <motion.div 
                      className={`p-2 rounded-lg ${stat.bgColor}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="text-3xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Información del Sistema
            </CardTitle>
            <CardDescription>
              Panel de control del simulador de homologación
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Funcionalidades Disponibles:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Registro y gestión de estudiantes</li>
              <li>Simulación de homologación de materias</li>
              <li>Consulta de planes de estudio (Actual y Propuesto)</li>
              <li>Generación de reportes PDF</li>
              {profile.role === "admin" && (
                <li className="text-primary font-medium">
                  Gestión completa de usuarios (Solo Administradores)
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Tu Rol:</h3>
            <div className="p-4 rounded-lg bg-muted/50">
              {profile.role === "admin" ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">Administrador del Sistema</p>
                  <p className="text-xs text-muted-foreground">
                    Tienes acceso completo a todas las funcionalidades, incluyendo:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    <li>Crear, editar y eliminar estudiantes</li>
                    <li>Crear, editar y eliminar usuarios</li>
                    <li>Acceso completo al módulo de usuarios</li>
                    <li>Visualización de todos los planes académicos</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Usuario Normal</p>
                  <p className="text-xs text-muted-foreground">
                    Puedes realizar las siguientes acciones:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    <li>Registrar nuevos estudiantes</li>
                    <li>Editar información de estudiantes</li>
                    <li>Ver información completa de estudiantes</li>
                    <li>Consultar planes de estudio</li>
                    <li>Generar reportes de homologación</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Nota:</strong> No puedes eliminar estudiantes ni acceder al módulo de
                    gestión de usuarios.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
