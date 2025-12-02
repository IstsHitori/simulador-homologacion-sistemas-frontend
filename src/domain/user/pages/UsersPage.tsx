import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users as UsersIcon } from "lucide-react";
import { useUsers, useDeleteUser } from "../hooks/useUserQueries";
import { Spinner } from "@/components/ui/spinner";
import { UserTable } from "../components/UserTable";
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
import type { User } from "../types";
import { CreateUserDialog } from "../components/CreateUserDialog";
import { UpdateUserPasswordDialog } from "../components/UpdateUserPasswordDialog";

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users, isLoading, refetch } = useUsers();
  const deleteMutation = useDeleteUser();

  const filteredUsers = users?.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(search) ||
      user.userName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsCreateOpen(true);
  };

  const handleUpdatePassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            <UsersIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Administra los usuarios del sistema
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
              setSelectedUser(null);
              setIsCreateOpen(true);
            }}
            className="gap-2 shadow-sm hover:shadow-md transition-smooth w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span className="sm:inline">Nuevo Usuario</span>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-sm hover:shadow-md transition-smooth">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Usuarios del Sistema</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {users?.length || 0} usuario{users?.length !== 1 ? "s" : ""} registrado{users?.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, usuario o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <UserTable
                users={filteredUsers || []}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onUpdatePassword={handleUpdatePassword}
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        user={selectedUser}
      />

      <UpdateUserPasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        userId={selectedUser?.id || ""}
        userName={selectedUser?.fullName || ""}
        onSuccess={() => refetch()}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario{" "}
              <span className="font-semibold">{userToDelete?.fullName}</span>. Esta
              acción no se puede deshacer.
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
