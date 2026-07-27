import React, { useContext, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";
import { userService } from "../services/userService";

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const { user, updateUser } = useContext(AuthContext);

  const changeName = useCallback(
    async (newName) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        const updatedUser = await userService.changeName(newName);
        updateUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error("Error changing name:", error);
        throw error;
      }
    },
    [user, updateUser],
  );

  const changeNickname = useCallback(
    async (newNickname) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        const updatedUser = await userService.changeNickname(newNickname);
        updateUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error("Error changing nickname:", error);
        throw error;
      }
    },
    [user, updateUser],
  );

  const changeEmail = useCallback(
    async (newEmail, password) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        const updatedUser = await userService.changeEmail(newEmail, password);
        updateUser(updatedUser);
        return updatedUser;
      } catch (error) {
        console.error("Error changing email:", error);
        throw error;
      }
    },
    [user, updateUser],
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      if (!user) {
        throw new Error("User is not authenticated");
      }

      try {
        await userService.changePassword(currentPassword, newPassword);
      } catch (error) {
        console.error("Error changing password:", error);
        throw error;
      }
    },
    [user],
  );

  const value = useMemo(
    () => ({
      changeName,
      changeNickname,
      changeEmail,
      changePassword,
    }),
    [changeName, changeNickname, changeEmail, changePassword],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
