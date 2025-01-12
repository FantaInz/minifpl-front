import React from "react";
import { Button, Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const MainErrorFallback = () => {
  const { t } = useTranslation();

  return (
    <Box
      role="alert"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={8}
    >
      <Text fontSize="2xl" fontWeight="bold" color="red.500" mb={4}>
        {t("errorFallback.message")}
      </Text>
      <Button colorScheme="red" onClick={() => window.location.reload()}>
        {t("errorFallback.reloadButton")}
      </Button>
    </Box>
  );
};
