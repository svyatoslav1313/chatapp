import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext";
import { Root } from "./Root";
import "@fontsource-variable/geist";
import { SocketProvider } from "./Context/SocketContext.jsx";
import { UserProvider } from "./Context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <UserProvider>
        <Root />
      </UserProvider>
    </SocketProvider>
  </AuthProvider>,
);
