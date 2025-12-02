import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, Download } from "lucide-react";
import type { GenerateReportResponse } from "../types";
import { generateHomologationPDF } from "@/shared/utils/pdfGenerator";

interface ShowReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GenerateReportResponse | null;
}

export function ShowReportDialog({
  open,
  onOpenChange,
  report,
}: ShowReportDialogProps) {
  if (!report) return null;

  const { student, subjectsToHomologate, subjectsToView } = report;

  const totalCreditsToHomologate = subjectsToHomologate.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  const totalCreditsToView = subjectsToView.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  const handleDownloadPDF = () => {
    generateHomologationPDF({
      message: report.message,
      student,
      subjectsToHomologate,
      subjectsToView,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-primary to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Reporte de Homologación
                </h2>
                <p className="text-muted-foreground">
                  Resumen de materias a homologar y pendientes
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {/* Student Info */}
              <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 shadow-md border border-blue-100 dark:border-blue-900">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Información del Estudiante
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombres</p>
                    <p className="font-semibold">{student.names}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Apellidos</p>
                    <p className="font-semibold">{student.lastNames}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Identificación
                    </p>
                    <p className="font-semibold">{student.identification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Semestre</p>
                    <p className="font-semibold">{student.semester}</p>
                  </div>
                </div>
              </div>

              {/* Credits Summary */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 border border-green-200 dark:border-green-900 shadow-md">
                  <h4 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
                    ✅ Materias a Homologar
                  </h4>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {subjectsToHomologate.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {totalCreditsToHomologate} créditos
                  </p>
                </div>

                <div className="bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl p-6 border border-orange-200 dark:border-orange-900 shadow-md">
                  <h4 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-2">
                    📚 Materias Pendientes
                  </h4>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {subjectsToView.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {totalCreditsToView} créditos
                  </p>
                </div>
              </div>

              {/* Subjects to Homologate */}
              {subjectsToHomologate.length > 0 && (
                <div className="border-2 border-green-200 dark:border-green-900 rounded-xl overflow-hidden bg-linear-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50">
                  <div className="bg-green-600 dark:bg-green-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      ✅ Materias a Homologar ({subjectsToHomologate.length})
                    </h3>
                  </div>
                  <div className="p-4">
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-3">
                        {subjectsToHomologate.map((subject, index) => (
                          <div
                            key={subject.id}
                            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500"
                          >
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                  #{index + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {subject.name}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                  <span>📋 {subject.code}</span>
                                  <span>📊 Semestre {subject.semester}</span>
                                  <span>⭐ {subject.credits} créditos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}

              {/* Subjects to View */}
              {subjectsToView.length > 0 && (
                <div className="border-2 border-orange-200 dark:border-orange-900 rounded-xl overflow-hidden bg-linear-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/50 dark:to-amber-950/50">
                  <div className="bg-orange-600 dark:bg-orange-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      📚 Materias Pendientes por Cursar ({subjectsToView.length}
                      )
                    </h3>
                  </div>
                  <div className="p-4">
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-3">
                        {subjectsToView.map((subject, index) => (
                          <div
                            key={subject.id}
                            className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500"
                          >
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                  #{index + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {subject.name}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                  <span>📋 {subject.code}</span>
                                  <span>📊 Semestre {subject.semester}</span>
                                  <span>⭐ {subject.credits} créditos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="px-8 bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Reporte PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
