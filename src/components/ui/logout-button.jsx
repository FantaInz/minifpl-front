import React from "react";
import { Button } from "@/components/ui/button";

export const LogoutButton = ({ onClick, isLoading, ...props }) => {
  return (
    <Button
      colorPalette="red"
      width="full"
      mt={5}
      onClick={onClick}
      loading={isLoading}
      {...props}
    >
      Wyloguj się
    </Button>
  );
};
