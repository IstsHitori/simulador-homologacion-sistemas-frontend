import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Shield,
  FileCheck,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";
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
    <div className="min-h-screen bg-linear-to-b from-green-50/30 via-white to-emerald-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100 dark:border-gray-800"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img src="/upc-logo.png" alt="logo-upc" width={35} className="drop-shadow-md" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">Simulador de Homologación</h1>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                Ingeniería en Sistemas - UPC
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowLogin(true)} 
            variant="outline"
            className="border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <Shield className="h-4 w-4 mr-2" />
            Acceso de Administración
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="text-red-500 dark:text-red-400 font-semibold text-sm tracking-wider uppercase">
                Sistema de Homologación UPC
              </span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Homologa,{" "}
              <span className="text-green-600 dark:text-green-400">avanza</span>
              <br />y vive una nueva
              <br />
              <span className="text-green-600 dark:text-green-400">
                experiencia
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Genera tu reporte de homologación de asignaturas de forma rápida y
              sencilla. Descubre qué materias puedes homologar y cuáles te
              faltan por cursar en tu nuevo programa académico.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Button
                size="lg"
                onClick={() => setShowReportDialog(true)}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Generar Reporte
              </Button>
            </div>
          </motion.div>

          {/* Right Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Decorative blobs */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 dark:bg-green-900/30 rounded-full blur-2xl opacity-60"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-200 dark:bg-emerald-900/30 rounded-full blur-2xl opacity-60"
              />

              {/* Main illustration card */}
              <div className="relative bg-linear-to-br from-green-400 via-emerald-400 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-700 rounded-3xl p-12 shadow-2xl">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <GraduationCap className="h-40 w-40 text-white drop-shadow-lg" />
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute top-8 right-8 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Rápido
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          En minutos
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute bottom-8 left-8 bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                        <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Oficial
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          UPC
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green-600 dark:text-green-400 font-semibold text-sm tracking-wider uppercase mb-4">
            Características
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Cómo funciona el sistema
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden group cursor-pointer h-full">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Reporte Instantáneo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Obtén tu reporte de homologación en segundos con información
                  detallada y precisa sobre tus asignaturas.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden group cursor-pointer h-full">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-linear-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <FileCheck className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Plan Personalizado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Visualiza las materias que puedes homologar según tu plan de
                  estudios anterior y tu perfil académico.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden group cursor-pointer h-full">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-linear-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  Seguro y Oficial
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sistema oficial del programa de Ingeniería en Sistemas de la
                  Universidad Popular del Cesar.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 dark:border-gray-800 mt-20 py-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/upc-logo.png"
                alt="logo-upc"
                width={30}
                className="drop-shadow-md"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Universidad Popular del Cesar
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Programa de Ingeniería en Sistemas
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 UPC. Todos los derechos reservados.
            </p>
          </div>
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
