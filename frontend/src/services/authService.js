import { authClient } from "../http/authClient";

function registration(name, nickname, email, password) {
  return authClient.post("/registration", {
    name,
    nickname,
    email,
    password,
  });
}

function login(email, password) {
  return authClient.post("/login", { email, password });
}

function refresh() {
  return authClient.get("/refresh");
}

function logout() {
  return authClient.post("/logout");
}

export const authService = {
  registration,
  login,
  refresh,
  logout,
};
