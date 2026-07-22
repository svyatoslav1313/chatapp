import { useContext } from "react";
import styles from "./App.module.scss";
import { AuthContext } from "./Context/AuthContext";
import { Header } from "./components/Header";
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
