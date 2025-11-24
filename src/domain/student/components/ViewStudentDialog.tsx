import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Student } from "../types";
import { Calendar, Mail, MapPin, Phone, User, type LucideIcon } from "lucide-react";

interface ViewStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function ViewStudentDialog({
  open,
  onOpenChange,
  student,
}: ViewStudentDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Información del Estudiante</DialogTitle>
          <DialogDescription>
            Detalles completos y materias del estudiante
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Datos Personales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={User} label="Identificación" value={student.identification} />
                <InfoItem
                  icon={User}
                  label="Nombre Completo"
                  value={`${student.names} ${student.lastNames}`}
                />
                <InfoItem icon={Mail} label="Email" value={student.email} />
                <InfoItem icon={Phone} label="Teléfono" value={student.telephone} />
                <InfoItem icon={MapPin} label="Ciudad" value={student.cityResidence} />
                <InfoItem icon={MapPin} label="Dirección" value={student.address} />
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Género</p>
                    <Badge variant="secondary">{student.gender}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Semestre</p>
                    <Badge variant="default">{student.semester}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Materias Aprobadas */}
            {student.approvedSubjects && student.approvedSubjects.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary">
                  Materias Aprobadas ({student.approvedSubjects.length})
                </h3>
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <div className="divide-y">
                    {student.approvedSubjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-4 hover:bg-background transition-smooth"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {subject.area.name} • {subject.plan.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">Sem. {subject.semester}</Badge>
                            <Badge variant="outline">{subject.credits} créditos</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Materias a Homologar */}
            {student.subjectsToHomologate && student.subjectsToHomologate.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-accent">
                  Materias a Homologar ({student.subjectsToHomologate.length})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="divide-y">
                    {student.subjectsToHomologate.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-4 hover:bg-muted/30 transition-smooth"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {subject.area.name} • {subject.plan.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">Sem. {subject.semester}</Badge>
                            <Badge variant="outline">{subject.credits} créditos</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
