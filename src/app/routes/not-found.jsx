import React from "react";
import { Heading, Text, VStack, Icon, Container } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const { data: user } = useUser();

  const targetPath = user
    ? paths.app.solver.getHref()
    : paths.auth.main.getHref();

  const buttonText = user
    ? t("notFoundPage.goToSolver")
    : t("notFoundPage.goToLogin");

  return (
    <Container
      maxW="container.md"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6} textAlign="center">
        <Icon boxSize="100px" color="red.500">
          <FiAlertTriangle />
        </Icon>

        <Heading size="4xl" fontWeight="bold" color="gray.800">
          404
        </Heading>

        <Text fontSize="lg" color="gray.600">
          {t("notFoundPage.message")}
        </Text>

        <Button
          as={RouterLink}
          to={targetPath}
          size="lg"
          borderRadius="full"
          boxShadow="md"
          colorPalette="purple"
        >
          {buttonText}
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;
