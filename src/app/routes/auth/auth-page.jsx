import React from "react";
import { Flex } from "@chakra-ui/react";
import LoginForm from "@/features/auth/login-form";

const AuthPage = () => {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <LoginForm />
    </Flex>
  );
};

export default AuthPage;
