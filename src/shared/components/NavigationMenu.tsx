import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Users,
  BookOpen,
  Home,
  Menu,
  X,
  LogOut,
  UserCog,
  Settings,
  HelpCircle,
  CirclePlus,
  Mail,
} from "lucide-react";
import useAuth from "@/domain/auth/hooks/useAuth";
import { useLogout } from "@/domain/auth/hooks/useLogout";

export function NavigationMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const logout = useLogout();

  const menuItems = [
    {
      path: "/app/home",
      label: "Dashboard",
      icon: Home,
      available: true,
    },
    {
      path: "/app/students",
      label: "Estudiantes",
      icon: Users,
      available: true,
    },
    {
      path: "/app/plans",
      label: "Planes",
      icon: BookOpen,
      available: true,
    },
    {
      path: "/app/users",
      label: "Usuarios",
      icon: UserCog,
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
        className={`fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-all duration-300 w-72 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-foreground">
                UPC Homologación
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMobileMenuClose}
              className="h-8 w-8 p-0 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Create Button */}
          <div className="px-4 mb-4">
            <Button
              className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              size="default"
            >
              <CirclePlus className="h-4 w-4" />
              Quick Create
            </Button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 px-4 space-y-1">
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
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
          </div>

          <Separator className="my-2" />

          {/* Bottom Actions */}
          <div className="px-4 pb-4 space-y-1">
            <button 
              onClick={() => {
                navigate("/app/settings");
                handleMobileMenuClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </button>
            <button 
              onClick={() => setIsHelpDialogOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Get Help</span>
            </button>
          </div>

          <Separator className="my-2" />

          {/* User Profile */}
          <div className="p-4">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                {profile.fullName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.userName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
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

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              ¿Necesitas ayuda?
            </DialogTitle>
            <DialogDescription className="text-base pt-4">
              Si necesitas solicitar ayuda o reportar algún problema, por favor contacta con el desarrollador.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">Contacto del Desarrollador:</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>desarrollador@upc.edu.co</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsHelpDialogOpen(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
