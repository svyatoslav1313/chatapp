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

  const updateUser = (user) => {
    setUser(user);
  };

  async function activate() {}

  async function registration(name, nickname, email, password) {
    try {
      return await authService.registration(name, nickname, email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const { user, accessToken } = await authService.login(email, password);

      accessTokenService.save(accessToken);
      setUser(user);
    } catch (error) {
      console.error(error);
      throw error;
    }
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
      updateUser,
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
