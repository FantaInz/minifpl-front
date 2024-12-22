import { configureAuth } from "react-query-auth";
import { api } from "./api-client";

const getUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const logout = async () => {
  await api.post("/auth/logout");
};

const authConfig = {
  userFn: getUser,
  logoutFn: logout,
};

export const { useUser, AuthLoader } = configureAuth(authConfig);
