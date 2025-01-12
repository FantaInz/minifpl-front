import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const NoPlansMessage = ({ onNavigateToSolver }) => {
  const { t } = useTranslation();

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
    >
      <Heading size="2xl" mb={4}>
        {t("noPlansMessage.title")}
      </Heading>
      <Text fontSize="lg" color="gray.500" mb={6}>
        {t("noPlansMessage.description")}
      </Text>
      <Button colorPalette="blue" size="xl" onClick={onNavigateToSolver}>
        {t("noPlansMessage.buttonText")}
      </Button>
    </Flex>
  );
};

export default NoPlansMessage;
