import React from "react";
import { Button } from "@/components/ui/button";

export const LogoutButton = React.forwardRef(function LogoutButton(
  { onClick, isLoading, ...props },
  ref,
) {
  return (
    <Button
      colorPalette="red"
      onClick={onClick}
      loading={isLoading}
      ref={ref}
      {...props}
    >
      Wyloguj się
    </Button>
  );
});
