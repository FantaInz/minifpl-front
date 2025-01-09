import Axios from "axios";
import qs from "qs";

import { env } from "@/config/env";
import { storage } from "@/utils/storage";

function authRequestInterceptor(config) {
  if (config.headers) {
    config.headers.Accept = "application/json";

    if (config.url.includes("/auth/login")) {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
  transformRequest: [
    (data, headers) => {
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        return qs.stringify(data);
      }
      return JSON.stringify(data);
    },
  ],
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const detail = error.response?.data?.detail || "";

    if (
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/user/register")
    ) {
      return Promise.reject(error);
    }

    if (status === 401 || detail === "Not authenticated") {
      localStorage.clear();
      const token = storage.getToken();
      if (token) {
        storage.clearToken();
      }
    }

    return Promise.reject(error);
  },
);
