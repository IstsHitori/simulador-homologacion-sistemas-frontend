import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Shield, FileCheck, ArrowRight } from "lucide-react";
import { useState } from "react";
import { LoginForm } from "@/domain/auth/components/LoginForm";
import { GenerateReportDialog } from "@/domain/student/components/GenerateReportDialog";

export function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  if (showLogin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-primary/5 via-background to-accent/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            onClick={() => setShowLogin(false)}
            className="mb-4"
          >
            ← Volver
          </Button>
          <LoginForm />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img src="/upc-logo.png" alt="logo-upc" width={30} />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg">Simulador de Homologación</h1>
              <p className="text-xs text-muted-foreground">
                Ingeniería en Sistemas - UPC
              </p>
            </div>
          </div>
          <Button onClick={() => setShowLogin(true)} variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Acceso Admin
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Simulador de Homologación
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Programa de Ingeniería en Sistemas
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              Universidad Popular del Cesar
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Genera tu reporte de homologación de asignaturas de forma rápida y
            sencilla. Descubre qué materias puedes homologar y cuáles te faltan
            por cursar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="pt-4"
          >
            <Button
              size="lg"
              onClick={() => setShowReportDialog(true)}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              <FileCheck className="h-5 w-5 mr-2" />
              Generar Reporte de Homologación
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20"
        >
          <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Reporte Instantáneo</h3>
              <p className="text-muted-foreground text-sm">
                Obtén tu reporte de homologación en segundos con información
                detallada y precisa.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-accent/10 rounded-full">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Plan de Estudios</h3>
              <p className="text-muted-foreground text-sm">
                Visualiza las materias que puedes homologar según tu plan de
                estudios anterior.
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-blue-600 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-lg">Seguro y Confiable</h3>
              <p className="text-muted-foreground text-sm">
                Sistema oficial del programa de Ingeniería en Sistemas de la
                UPC.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-background/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 Universidad Popular del Cesar - Programa de Ingeniería en
            Sistemas
          </p>
        </div>
      </footer>

      {/* Dialog de Generar Reporte */}
      <GenerateReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
    </div>
  );
}
