import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

export const App = () => {
  const { isChecked } = useContext(AuthContext);

  if (!isChecked) {
    return <Loader />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
