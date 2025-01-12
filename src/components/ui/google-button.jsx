import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { useGoogleAuthLink } from "@/features/auth/api/get-google-auth-link";

const GoogleLoginButton = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useGoogleAuthLink();

  const handleGoogleLogin = () => {
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      width="full"
      loading={isLoading}
      mt={5}
      variant="outline"
      colorPalette="gray"
    >
      <FcGoogle /> {t("googleLogin.text")}
    </Button>
  );
};

export default GoogleLoginButton;
