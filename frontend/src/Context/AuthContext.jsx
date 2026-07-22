import { useEffect, useMemo, useState } from "react";
import { createContext } from "react";
import { authService } from "../services/authService";
import { accessTokenService } from "../services/accessTokenService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    void checkAuth();
  }, []);

  async function activate() {}

  async function registration(name, nickname, email, password) {
    return authService.registration(name, nickname, email, password);
  }

  async function login(email, password) {
    const { user, accessToken } = await authService.login(email, password);

    accessTokenService.save(accessToken);
    setUser(user);
  }

  async function checkAuth() {
    try {
      const { accessToken, user } = await authService.refresh();
      accessTokenService.save(accessToken);
      setUser(user);
    } catch {
      console.log("User is not authenticated");
    } finally {
      setChecked(true);
    }
  }

  async function logout() {
    await authService.logout();

    accessTokenService.remove();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isChecked,
      activate,
      registration,
      login,
      checkAuth,
      logout,
    }),
    [user, isChecked],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
