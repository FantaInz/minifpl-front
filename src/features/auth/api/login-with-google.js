import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useLogin } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { paths } from "@/config/paths";
import { toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";

export const loginWithGoogle = async (code) => {
  try {
    return await api.get(`/api/google/auth`, {
      params: { code },
    });
  } catch (error) {
    console.error(
      "Błąd pobierania danych autoryzacji Google:",
      error.response || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Nie udało się pobrać danych autoryzacji.",
    );
  }
};

export const useGoogleLogin = () => {
  const { mutate: login } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (code) => {
      const googleData = await loginWithGoogle(code);
      console.log(googleData);
      return googleData;
    },
    onSuccess: (googleData) => {
      login(googleData, {
        onSuccess: () => {
          navigate(paths.app.solver.getHref());
        },
      });
    },
    onError: () => {
      toaster.create({
        title: t("googleLogin.errorTitle"),
        description: t("googleLogin.errorMessage"),
        type: "error",
        duration: 4000,
      });
    },
  });
};
