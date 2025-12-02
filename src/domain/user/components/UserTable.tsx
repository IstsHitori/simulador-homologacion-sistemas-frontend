import type { User } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/domain/auth/hooks/useAuth";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onUpdatePassword: (user: User) => void;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onUpdatePassword,
}: UserTableProps) {
  const { profile } = useAuth();

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nombre Completo</TableHead>
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold text-center">Rol</TableHead>
              <TableHead className="font-semibold text-center">Estado</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay usuarios registrados
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/30 transition-smooth"
                >
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role === "admin" ? "Administrador" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={user.isActive ? "default" : "destructive"}
                      className={user.isActive ? "bg-accent" : ""}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUpdatePassword(user)}
                        title="Actualizar contraseña"
                        className="hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-smooth"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(user)}
                        disabled={user.id === profile.id.toString()}
                        className="hover:bg-yellow-600/10 hover:text-yellow-700 transition-smooth"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(user)}
                        disabled={user.id === profile.id.toString()}
                        className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )} 
          </TableBody>
        </Table>
      </div>

      {/* Vista de tarjetas para móvil y tablet */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="text-center py-8 px-4 border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">No hay usuarios registrados</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg bg-card p-4 space-y-3 shadow-sm hover:shadow-md transition-smooth"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {user.fullName}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    @{user.userName}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.role === "admin" ? "Admin" : "Normal"}
                  </Badge>
                  <Badge
                    variant={user.isActive ? "default" : "destructive"}
                    className={`text-xs ${user.isActive ? "bg-accent" : ""}`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              
              <div className="text-xs sm:text-sm">
                <p className="text-muted-foreground truncate">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdatePassword(user)}
                  className="flex-1 text-xs hover:bg-blue-500/10 hover:text-blue-600"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Contraseña
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(user)}
                  disabled={user.id === profile.id.toString()}
                  className="flex-1 text-xs hover:bg-yellow-600/10 hover:text-yellow-700"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(user)}
                  disabled={user.id === profile.id.toString()}
                  className="text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
