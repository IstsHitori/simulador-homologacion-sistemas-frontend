import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle2, BookOpen } from "lucide-react";
import type { CreateStudentResponse } from "../types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateHomologationPDF } from "@/shared/utils/pdfGenerator";

interface HomologationResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: CreateStudentResponse | null;
}

export function HomologationResultDialog({
  open,
  onOpenChange,
  result,
}: HomologationResultDialogProps) {
  if (!result) return null;
  
  const handlePrintReport = () => {
    generateHomologationPDF(result);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-accent" />
            Resultado de Homologación
          </DialogTitle>
          <DialogDescription>
            <span className="block text-base font-semibold text-foreground mt-2">
              {result.student.names} {result.student.lastNames}
            </span>
            <span className="text-sm text-muted-foreground">
              ID: {result.student.identification}
            </span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-6 pr-4 pb-6">
            {/* Materias a Homologar */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Materias a Homologar ({result.subjectsToHomologate.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Estas materias del nuevo plan serán homologadas
              </p>
              <div className="border rounded-lg overflow-hidden">
                {result.subjectsToHomologate.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay materias para homologar
                  </div>
                ) : (
                  <div className="divide-y">
                    {result.subjectsToHomologate.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-4 hover:bg-muted/30 transition-smooth"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {subject.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {subject.area.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              Sem. {subject.semester}
                            </Badge>
                            <Badge variant="outline">
                              {subject.credits} créditos
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Materias Faltantes por Ver */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Materias Faltantes por Ver ({result.subjectsToView.length})
              </h3>
              <p className="text-sm text-muted-foreground">
                Materias que el estudiante aún debe cursar
              </p>
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                {result.subjectsToView.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No hay materias faltantes por ver
                  </div>
                ) : (
                  <div className="divide-y">
                    {result.subjectsToView.map((subject) => (
                      <div
                        key={subject.id}
                        className="p-4 hover:bg-background transition-smooth"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">
                              {subject.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {subject.area.name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              Sem. {subject.semester}
                            </Badge>
                            <Badge variant="outline">
                              {subject.credits} créditos
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={handlePrintReport} className="gap-2">
            <FileDown className="h-4 w-4" />
            Imprimir Reporte PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
