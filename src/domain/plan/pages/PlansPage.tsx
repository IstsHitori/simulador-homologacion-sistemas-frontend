import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { usePlans } from "../hooks/usePlanQueries";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subject } from "../types";
import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 7;

interface SubjectsTableProps {
  subjects: Subject[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filterSubjects: (subjects: Subject[]) => Subject[];
}

// Separate component to avoid hook ordering issues
function SubjectsTable({
  subjects,
  currentPage,
  setCurrentPage,
  filterSubjects,
}: SubjectsTableProps) {
  const filteredSubjects = filterSubjects(subjects);
  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubjects = filteredSubjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {filteredSubjects.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">
          No se encontraron materias con los filtros seleccionados
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Materia</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="w-24">Área</TableHead>
                  <TableHead className="w-20 text-center">Semestre</TableHead>
                  <TableHead className="w-20 text-center">Créditos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubjects.map((subject, index) => (
                  <TableRow
                    key={subject.id}
                    className={index % 2 === 0 ? "bg-muted/30" : ""}
                  >
                    <TableCell className="font-semibold">
                      {subject.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {subject.code &&
                      subject.code !== "N/A" &&
                      subject.code.trim()
                        ? subject.code
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{subject.area.name}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{subject.semester}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">{subject.credits}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredSubjects.length)} de{" "}
              {filteredSubjects.length} materias
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="gap-1 text-xs sm:text-sm px-2 sm:px-3"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Anterior</span>
              </Button>
              <div className="flex items-center gap-1 sm:gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-xs sm:text-sm"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="gap-1 text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden xs:inline">Siguiente</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PlansPage() {
  const { data: plans, isLoading } = usePlans();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [filterCredits, setFilterCredits] = useState<string>("all");
  const [currentPageOld, setCurrentPageOld] = useState(1);
  const [currentPageNew, setCurrentPageNew] = useState(1);

  // Memoized filter logic
  const filterSubjects = useMemo(() => {
    return (subjects: Subject[]) => {
      return subjects.filter((subject) => {
        const matchesSearch =
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.code?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea =
          filterArea === "all" || subject.area.name === filterArea;
        const matchesSemester =
          filterSemester === "all" ||
          subject.semester.toString() === filterSemester;
        const matchesCredits =
          filterCredits === "all" ||
          (filterCredits === "max4" && subject.credits <= 4) ||
          subject.credits.toString() === filterCredits;
        return matchesSearch && matchesArea && matchesSemester && matchesCredits;
      });
    };
  }, [searchTerm, filterArea, filterSemester, filterCredits]);

  // Get unique areas and semesters
  const allSubjects = useMemo(
    () =>
      plans ? [...plans.oldPlan.subjects, ...plans.newPlan.subjects] : [],
    [plans]
  );

  const uniqueAreas = useMemo(
    () => Array.from(new Set(allSubjects.map((s) => s.area.name))).sort(),
    [allSubjects]
  );

  const uniqueSemesters = useMemo(
    () =>
      Array.from(new Set(allSubjects.map((s) => s.semester)))
        .sort((a, b) => a - b)
        .map(String),
    [allSubjects]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPageOld(1);
    setCurrentPageNew(1);
  };

  const handleAreaChange = (value: string) => {
    setFilterArea(value);
    setCurrentPageOld(1);
    setCurrentPageNew(1);
  };

  const handleSemesterChange = (value: string) => {
    setFilterSemester(value);
    setCurrentPageOld(1);
    setCurrentPageNew(1);
  };

  const handleCreditsChange = (value: string) => {
    setFilterCredits(value);
    setCurrentPageOld(1);
    setCurrentPageNew(1);
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
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            Planes de Estudio
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Consulta los planes académicos actuales y propuestos
          </p>
        </div>
      </motion.div>

      {/* Global Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2 block">
            Buscar por nombre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materia..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2 block">
            Área
          </label>
          <Select value={filterArea} onValueChange={handleAreaChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Todas las áreas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {uniqueAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2 block">
            Semestre
          </label>
          <Select value={filterSemester} onValueChange={handleSemesterChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Todos los semestres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los semestres</SelectItem>
              {uniqueSemesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  Semestre {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-muted-foreground mb-1.5 sm:mb-2 block">
            Créditos
          </label>
          <Select value={filterCredits} onValueChange={handleCreditsChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Todos los créditos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los créditos</SelectItem>
              <SelectItem value="max4">Máximo 4 créditos</SelectItem>
              <SelectItem value="2">2 créditos</SelectItem>
              <SelectItem value="3">3 créditos</SelectItem>
              <SelectItem value="4">4 créditos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs defaultValue="old" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-full sm:max-w-md">
            <TabsTrigger value="old" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Plan Actual</span>
              <span className="xs:hidden">Actual</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Plan Propuesto</span>
              <span className="xs:hidden">Propuesto</span>
            </TabsTrigger>
          </TabsList>

          {/* Plan Actual */}
          <TabsContent value="old" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card className="shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 break-words">
                      {plans?.oldPlan.plan.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 text-xs sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">
                        Vigente desde:{" "}
                        {new Date(
                          plans?.oldPlan.plan.startDate || ""
                        ).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-xs sm:text-sm md:text-base px-3 py-1 sm:px-4 sm:py-2 shrink-0">
                    {plans?.oldPlan.quantity} Materias
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <SubjectsTable
                  subjects={plans?.oldPlan.subjects || []}
                  currentPage={currentPageOld}
                  setCurrentPage={setCurrentPageOld}
                  filterSubjects={filterSubjects}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plan Propuesto */}
          <TabsContent value="new" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Card className="shadow-sm">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl flex items-center gap-2 break-words">
                      {plans?.newPlan.plan.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2 text-xs sm:text-sm">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">
                        Vigente desde:{" "}
                        {new Date(
                          plans?.newPlan.plan.startDate || ""
                        ).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="default" className="text-xs sm:text-sm md:text-base px-3 py-1 sm:px-4 sm:py-2 shrink-0">
                    {plans?.newPlan.quantity} Materias
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <SubjectsTable
                  subjects={plans?.newPlan.subjects || []}
                  currentPage={currentPageNew}
                  setCurrentPage={setCurrentPageNew}
                  filterSubjects={filterSubjects}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
