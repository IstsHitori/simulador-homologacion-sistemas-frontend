import { useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { StudentTable } from "../components/StudentTable";
import { useStudents, useDeleteStudent } from "../hooks/useStudentQueries";
import { Spinner } from "@/components/ui/spinner";
import { ViewStudentDialog } from "../components/ViewStudentDialog";
import { HomologationResultDialog } from "../components/HomologationResultDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Student, CreateStudentResponse } from "../types";
import { CreateStudentDialog } from "../components/CreateStudentDialog";

export function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [homologationResult, setHomologationResult] =
    useState<CreateStudentResponse | null>(null);
  const [isHomologationOpen, setIsHomologationOpen] = useState(false);

  const { data: students, isLoading } = useStudents();
  const deleteMutation = useDeleteStudent();

  const filteredStudents = students?.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.identification.toLowerCase().includes(search) ||
      student.names.toLowerCase().includes(search) ||
      student.lastNames.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search)
    );
  });

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsCreateOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete.id);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleCreateSuccess = (result: CreateStudentResponse) => {
    setIsCreateOpen(false);
    setHomologationResult(result);
    setIsHomologationOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Gestión de Estudiantes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y simula homologaciones de estudiantes
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => {
              setSelectedStudent(null);
              setIsCreateOpen(true);
            }}
            className="gap-2 shadow-sm hover:shadow-md transition-smooth"
          >
            <Plus className="h-4 w-4" />
            Nuevo Estudiante
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-smooth">
          <CardHeader>
            <CardTitle className="text-xl">Estudiantes Registrados</CardTitle>
            <CardDescription>
              {students?.length || 0} estudiante
              {students?.length !== 1 ? "s" : ""} en total
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por identificación, nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <StudentTable
                students={filteredStudents || []}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <CreateStudentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        student={selectedStudent}
        onSuccess={handleCreateSuccess}
      />

      <ViewStudentDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        student={selectedStudent}
      />

      <HomologationResultDialog
        open={isHomologationOpen}
        onOpenChange={setIsHomologationOpen}
        result={homologationResult}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al estudiante{" "}
              <span className="font-semibold">
                {studentToDelete?.names} {studentToDelete?.lastNames}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
