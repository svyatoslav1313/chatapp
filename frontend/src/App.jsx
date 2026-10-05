import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import styles from "./App.module.scss";

export const App = () => {
  const { isChecked } = useContext(AuthContext);

  if (!isChecked) {
    return (
      <div className={styles.splash}>
        <Loader className={styles.spinner} />
      </div>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};
