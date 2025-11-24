import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  Home,
  Menu,
  X,
  LogOut,
  UserCog,
} from "lucide-react";
import useAuth from "@/domain/auth/hooks/useAuth";
import { useLogout } from "@/domain/auth/hooks/useLogout";

export function NavigationMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = useAuth();
  const logout = useLogout();

  const menuItems = [
    {
      path: "/app/home",
      label: "Inicio",
      icon: Home,
      description: "Panel principal",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      available: true,
    },
    {
      path: "/app/students",
      label: "Estudiantes",
      icon: Users,
      description: "Gestión de estudiantes",
      color: "text-primary",
      bgColor: "bg-primary/10",
      available: true,
    },
    {
      path: "/app/plans",
      label: "Planes",
      icon: BookOpen,
      description: "Planes de estudio",
      color: "text-accent",
      bgColor: "bg-accent/10",
      available: true,
    },
    {
      path: "/app/users",
      label: "Usuarios",
      icon: UserCog,
      description: "Gestión de usuarios",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      available: profile.role === "admin",
    },
  ];

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      <nav
        className={`fixed top-0 left-0 h-full bg-background/98 backdrop-blur-sm border-r border-border z-40 transition-all duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-base md:text-lg font-bold text-foreground">
                    UPC Homologación
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Simulador de Homologación
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 hidden lg:flex"
            >
              {isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMobileMenuClose}
              className="h-8 w-8 p-0 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!isCollapsed && (
            <Card className="mb-4 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-full">
                    <UserCog className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {profile.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.role === "admin" ? "Administrador" : "Usuario"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-1 mb-6">
            {menuItems
              .filter((item) => item.available)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleMobileMenuClose}
                    className={`
                                            w-full p-2 rounded-lg text-left transition-all duration-200 block
                                            hover:scale-105 hover:shadow-sm
                                            ${
                                              isActive
                                                ? "bg-primary/10 border border-primary/20"
                                                : "hover:bg-muted/50"
                                            }
                                            ${
                                              isCollapsed
                                                ? "flex justify-center"
                                                : "flex items-center gap-2"
                                            }
                                        `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isActive ? item.bgColor : "bg-muted/30"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? item.color : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
          </div>

          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Acciones
              </h3>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className={`${
                isCollapsed ? "w-full p-2 h-10" : "w-full justify-start gap-2"
              } text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent`}
              title={isCollapsed ? "Cerrar Sesión" : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </nav>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden h-10 w-10 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
