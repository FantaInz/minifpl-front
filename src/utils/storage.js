import Cookies from "js-cookie";

export const storage = {
  getToken: () => {
    const token = Cookies.get("access_token");
    return token ? JSON.parse(token) : null;
  },

  setToken: (token) => {
    Cookies.set("access_token", JSON.stringify(token), {
      expires: 1 / 48,
      secure: true,
      sameSite: "Strict",
    });
  },

  clearToken: () => {
    Cookies.remove("access_token");
  },
};
