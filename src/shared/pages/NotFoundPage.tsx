import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="text-center space-y-8">
          {/* Error Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-destructive to-destructive/80 rounded-full p-6 shadow-xl">
                <AlertCircle className="h-24 w-24 text-white" strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>

          {/* 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-7xl sm:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              404
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              Página No Encontrada
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Lo sentimos, la página que buscas no existe. Es posible que haya sido eliminada,
            movida o que hayas escrito incorrectamente la URL.
          </motion.p>

          {/* Search suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-muted/50 border border-primary/10 rounded-lg p-4 sm:p-6 max-w-lg mx-auto"
          >
            <p className="text-sm font-medium text-foreground mb-3">
              Cosas que puedes intentar:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">→</span>
                <span>Verifica que la URL sea correcta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">→</span>
                <span>Vuelve al inicio y navega desde el menú</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">→</span>
                <span>Si el problema persiste, contacta al administrador</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="gap-2 group hover:gap-3 transition-all"
            >
              <ArrowLeft className="h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
              Atrás
            </Button>
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
            >
              <Home className="h-4 w-4" />
              Ir al Inicio
            </Button>
          </motion.div>

          {/* Decorative grid pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -z-10 inset-0 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-px h-96 opacity-10">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-primary/20 rounded-lg" />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
