import { Navigate, Outlet } from "react-router-dom";
export default function PublicLayout() {
  const authToken = localStorage.getItem("authToken");

  if (authToken) return <Navigate to={"/app/home"} />;
  return (
    <div>
      <Outlet />
    </div>
  );
}
