import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Lock } from "lucide-react";
import { UpdateProfileForm } from "../components/UpdateProfileForm";
import { UpdatePasswordForm } from "../components/UpdatePasswordForm";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <motion.div 
          className="p-2 bg-primary/10 rounded-lg"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.6 }}
        >
          <Settings className="h-6 w-6 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona tu información de perfil y seguridad
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-2">
              <Lock className="h-4 w-4" />
              Contraseña
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab === "profile" ? "profile-tab" : "password-tab"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "profile" && (
                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Actualizar Perfil</CardTitle>
                      <CardDescription>
                        Actualiza tu información personal. No podrás cambiar tu
                        contraseña desde aquí.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UpdateProfileForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {activeTab === "password" && (
                <TabsContent value="password" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cambiar Contraseña</CardTitle>
                      <CardDescription>
                        Actualiza tu contraseña. Asegúrate de usar una contraseña
                        segura.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UpdatePasswordForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}
