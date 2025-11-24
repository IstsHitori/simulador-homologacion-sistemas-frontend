import type { Student } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import useAuth from "@/domain/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({
  students,
  onView,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const { profile } = useAuth();
  const isAdmin = profile.role === "admin";

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Identificación</TableHead>
            <TableHead className="font-semibold">Nombres</TableHead>
            <TableHead className="font-semibold">Apellidos</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold text-center">
              Semestre
            </TableHead>
            <TableHead className="font-semibold text-center">Género</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No hay estudiantes registrados
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/30 transition-smooth">
                <TableCell className="font-medium">
                  {student.identification}
                </TableCell>
                <TableCell>{student.names}</TableCell>
                <TableCell>{student.lastNames}</TableCell>
                <TableCell className="text-muted-foreground">
                  {student.email}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{student.semester}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm">{student.gender}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(student)}
                      className="hover:bg-primary/10 hover:text-primary transition-smooth"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(student)}
                      className="hover:bg-accent/10 hover:text-blue-600 transition-smooth"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(student)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
