import React from "react";
import { Box, Heading, Button } from "@chakra-ui/react";

const AuthPage = () => {
  return (
    <Box className="flex h-screen w-screen flex-col items-center justify-center">
      <Heading mb={6}>Logowanie / Rejestracja</Heading>
      <Button colorScheme="blue" mb={4}>
        Zaloguj się
      </Button>
      <Button colorScheme="green">Zarejestruj się</Button>
    </Box>
  );
};

export default AuthPage;
