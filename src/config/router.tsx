import { LoginForm } from "@/domain/auth/components/LoginForm";
import PrivateLayout from "@/shared/layouts/PrivateLayout";
import PublicLayout from "@/shared/layouts/PublicLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { StudentsPage } from "@/domain/student/pages/StudentsPage";
import { PlansPage } from "@/domain/plan/pages/PlansPage";
import { UsersPage } from "@/domain/user/pages/UsersPage";
import { HomePage } from "@/shared/pages/HomePage";
import SettingsPage from "@/domain/auth/pages/SettingsPage";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { LandingPage } from "@/shared/pages/LandingPage";

export const router = createBrowserRouter([
  //Public landing page
  {
    path: "/",
    element: <LandingPage />,
  },
  //Public login
  {
    path: "/login",
    element: <PublicLayout />,
    children: [
      {
        path: "",
        element: <LoginForm />,
      },
    ],
  },
  //Private layout, la aplicacion dentro en si
  {
    path: "/app",
    element: <PrivateLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/app/home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "plans",
        element: <PlansPage />,
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  //404 Not Found - debe estar al final
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
