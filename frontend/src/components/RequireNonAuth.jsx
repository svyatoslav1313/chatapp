import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";

export const RequireNonAuth = () => {
  const { isChecked, user } = useContext(AuthContext);

  if (!isChecked) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/main" replace />;
  }

  return <Outlet />;
};
