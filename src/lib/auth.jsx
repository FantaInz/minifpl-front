import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import React from "react";
import PropTypes from "prop-types";

import { api } from "./api-client";
import { storage } from "@/utils/storage";
import { paths } from "@/config/paths";

const getUser = async () => {
  const token = storage.getToken();
  if (!token) {
    console.log("Brak tokena - użytkownik niezalogowany.");
    return null;
  }
  try {
    const response = await api.get("/api/auth/me");
    return response;
  } catch (error) {
    console.error("Błąd pobierania użytkownika:", error.message);
    storage.clearToken();
    return null;
  }
};

const login = async (data) => {
  const formData = {
    grant_type: "password",
    username: data.username,
    password: data.password,
    scope: "",
    client_id: "string",
    client_secret: "string",
  };

  const response = await api.post("/api/auth/login", formData);

  storage.setToken(response.access_token);
  return getUser();
};

const register = async (data) => {
  await api.post("/api/user/register", data);
  return null;
};

const logout = async () => {
  storage.clearToken();
  window.location.href = paths.auth.main.getHref();
};

const authConfig = {
  userFn: getUser,
  loginFn: login,
  registerFn: register,
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return (
      <Navigate
        to={paths.auth.main.getHref()}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
