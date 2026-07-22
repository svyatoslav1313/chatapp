import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext";
import { Root } from "./Root";
import "@fontsource-variable/geist";
import { SocketProvider } from "./Context/SocketContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <Root />
    </SocketProvider>
  </AuthProvider>,
);
