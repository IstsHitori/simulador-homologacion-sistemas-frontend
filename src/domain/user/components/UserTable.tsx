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
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/domain/auth/hooks/useAuth";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const { profile } = useAuth();

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
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
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-smooth">
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
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
                      onClick={() => onEdit(user)}
                      disabled={user.id === profile.id.toString()}
                      className="hover:bg-accent/10 hover:text-accent transition-smooth"
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
  );
}
