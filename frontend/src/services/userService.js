import { httpClient } from "../http/httpClient";

function changeName(newName) {
  return httpClient.patch("/user/update-name", {
    newName,
  });
}

function changeNickname(newNickname) {
  return httpClient.patch("/user/update-nickname", {
    newNickname,
  });
}

function changeEmail(newEmail, password) {
  return httpClient.patch("/user/update-email", {
    newEmail,
    password,
  });
}

function changePassword(currentPassword, newPassword) {
  return httpClient.patch("/user/update-password", {
    currentPassword,
    newPassword,
  });
}

export const userService = {
  changeName,
  changeNickname,
  changeEmail,
  changePassword,
};
