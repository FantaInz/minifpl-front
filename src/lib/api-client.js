import Axios from "axios";
import qs from "qs";

import { env } from "@/config/env";
import { paths } from "@/config/paths";
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
    return response.data; // Sukces
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    const status = error.response?.status;
    const requestUrl = error.config.url;

    if (
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/user/register")
    ) {
      return Promise.reject(error);
    }

    if (status === 401) {
      const token = storage.getToken();
      if (token) {
        storage.clearToken(); // Usuwamy token
        const searchParams = new URLSearchParams();
        const redirectTo =
          searchParams.get("redirectTo") || window.location.pathname;
        window.location.href = paths.auth.main.getHref(redirectTo);
      }
    }

    return Promise.reject(error);
  },
);
