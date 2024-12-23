import React from "react";
import { configureAuth } from "react-query-auth";
import { Navigate } from "react-router";
import PropTypes from "prop-types";

import { api } from "./api-client";
import { paths } from "@/config/paths";

const getUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const logout = async () => {
  await api.post("/auth/logout");
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data) => {
    console.log("Logging in:", data);
    return { id: 1, name: "Test User" };
  },
  registerFn: async (data) => {
    console.log("Registering:", data);
    return { id: 2, name: "New User" };
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }) => {
  const user = useUser();

  if (!user.data) {
    return <Navigate to={paths.auth.main.getHref()} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
