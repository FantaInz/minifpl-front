import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const LogoutButton = React.forwardRef(function LogoutButton(
  { onClick, isLoading, ...props },
  ref,
) {
  const { t } = useTranslation();

  return (
    <Button
      colorPalette="red"
      onClick={onClick}
      loading={isLoading}
      ref={ref}
      {...props}
    >
      {t("buttons.logout")}
    </Button>
  );
});
