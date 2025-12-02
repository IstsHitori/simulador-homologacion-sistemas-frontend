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
import { Edit, Eye, Trash2, FileText } from "lucide-react";
import useAuth from "@/domain/auth/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onGenerateReport: (student: Student) => void;
}

export function StudentTable({
  students,
  onView,
  onEdit,
  onDelete,
  onGenerateReport,
}: StudentTableProps) {
  const { profile } = useAuth();
  const isAdmin = profile.role === "admin";

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm overflow-hidden">
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
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No hay estudiantes registrados
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-muted/30 transition-smooth"
                >
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
                        onClick={() => onGenerateReport(student)}
                        className="hover:bg-green-600/10 hover:text-green-600 transition-smooth"
                        title="Generar Reporte"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
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
                        className="hover:bg-blue-600/10 hover:text-blue-600 transition-smooth"
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

      {/* Vista de tarjetas para móvil y tablet */}
      <div className="md:hidden space-y-3">
        {students.length === 0 ? (
          <div className="text-center py-8 px-4 border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground">No hay estudiantes registrados</p>
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="border rounded-lg bg-card p-4 space-y-3 shadow-sm hover:shadow-md transition-smooth"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base truncate">
                    {student.names} {student.lastNames}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {student.identification}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Badge variant="secondary" className="text-xs">{student.semester}</Badge>
                </div>
              </div>
              
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-muted-foreground truncate">
                  <span className="font-medium">Email:</span> {student.email}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Género:</span> {student.gender}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGenerateReport(student)}
                  className="flex-1 text-xs hover:bg-green-600/10 hover:text-green-600"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Reporte
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(student)}
                  className="flex-1 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(student)}
                  className="flex-1 text-xs hover:bg-blue-600/10 hover:text-blue-600"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(student)}
                    className="text-xs hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
