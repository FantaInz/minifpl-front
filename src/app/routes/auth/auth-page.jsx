import React from "react";
import { Flex } from "@chakra-ui/react";
import AuthTabs from "@/features/auth/auth-tabs";

const AuthPage = () => {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <AuthTabs />
    </Flex>
  );
};

export default AuthPage;
