import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Calendar, Award } from "lucide-react";
import { usePlans } from "../hooks/usePlanQueries";
import { Spinner } from "@/components/ui/spinner";
import type { Subject } from "../types";

export function PlansPage() {
  const { data: plans, isLoading } = usePlans();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const SubjectCard = ({ subject }: { subject: Subject }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-4 border rounded-lg hover:shadow-md hover:bg-muted/30 transition-smooth"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-lg text-foreground">{subject.name}</h4>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <Award className="h-3 w-3" />
            {subject.area.name}
          </p>
          {subject.code && subject.code !== "N/A" && (
            <p className="text-xs text-muted-foreground mt-1">Código: {subject.code}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge variant="secondary" className="whitespace-nowrap">
            Semestre {subject.semester}
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            {subject.credits} créditos
          </Badge>
        </div>
      </div>
    </motion.div>
  );

  // Group subjects by semester
  const groupBySemester = (subjects: Subject[]) => {
    const grouped: Record<number, Subject[]> = {};
    subjects.forEach((subject) => {
      if (!grouped[subject.semester]) {
        grouped[subject.semester] = [];
      }
      grouped[subject.semester].push(subject);
    });
    return grouped;
  };

  const oldPlanBySemester = plans ? groupBySemester(plans.oldPlan.subjects) : {};
  const newPlanBySemester = plans ? groupBySemester(plans.newPlan.subjects) : {};

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Planes de Estudio
          </h1>
          <p className="text-muted-foreground mt-1">
            Consulta los planes académicos actuales y propuestos
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="old" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="old" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Plan Actual
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Plan Propuesto
            </TabsTrigger>
          </TabsList>

          {/* Plan Actual */}
          <TabsContent value="old" className="space-y-6 mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {plans?.oldPlan.plan.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    Vigente desde: {new Date(plans?.oldPlan.plan.startDate || "").toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {plans?.oldPlan.quantity} Materias
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(oldPlanBySemester)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((semester) => (
                  <div key={semester} className="space-y-3">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Semestre {semester}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {oldPlanBySemester[parseInt(semester)].map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plan Propuesto */}
        <TabsContent value="new" className="space-y-6 mt-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {plans?.newPlan.plan.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    Vigente desde: {new Date(plans?.newPlan.plan.startDate || "").toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {plans?.newPlan.quantity} Materias
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(newPlanBySemester)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((semester) => (
                  <div key={semester} className="space-y-3">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Semestre {semester}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newPlanBySemester[parseInt(semester)].map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} />
                      ))}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
