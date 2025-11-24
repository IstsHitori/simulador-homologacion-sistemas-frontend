import { LoginForm } from "@/domain/auth/components/LoginForm";
import PrivateLayout from "@/shared/layouts/PrivateLayout";
import PublicLayout from "@/shared/layouts/PublicLayout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  //Public layaut donde esta el login
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "",
        element: <LoginForm />,
      },
    ],
  },
  //Private layaout, la aplicacion dentro en si
  {
    path: "/app",
    element: <PrivateLayout />,
    children: [],
  },
]);
