import React from "react";
import { Box, Tabs } from "@chakra-ui/react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import Logo from "@/components/ui/logo";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = React.useState("login");

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      width={["90%", "400px"]}
    >
      <Box display="flex" justifyContent="center" mb={6}>
        <Logo size="2xl" />
      </Box>

      <Tabs.Root
        value={activeTab}
        onValueChange={(e) => setActiveTab(e.value)}
        fitted
      >
        <Tabs.List>
          <Tabs.Trigger value="login">Logowanie</Tabs.Trigger>
          <Tabs.Trigger value="register">Rejestracja</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login">
          <LoginForm />
        </Tabs.Content>
        <Tabs.Content value="register">
          <RegisterForm />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default AuthTabs;
