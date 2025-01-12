import React from "react";
import { Box, Tabs } from "@chakra-ui/react";

import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import Logo from "@/components/ui/logo";
import LogoutModal from "./logout-modal";
import { useUser, useLogout } from "@/lib/auth";
import { useNavigation } from "@/hooks/use-navigation";
import { useQueryClient } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { api } from "@/lib/api-client.js";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = React.useState("login");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: user } = useUser();
  const logout = useLogout();
  const { goToSolver } = useNavigation();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (user && !logout.isLoading) {
        setIsModalOpen(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [user, logout.isLoading]);

  const handleLogout = async () => {
    queryClient.clear();
    await logout.mutateAsync();
    setIsModalOpen(false);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    goToSolver();
  };
  const getGoogleLink = async () => {
    try {
      return api.get("/api/google/login");
    } catch (error) {
      console.error("Błąd logowania:", error.response || error.message);
      throw new Error(
        error.response?.data?.message ||
          "Logowanie przez google chwilowo niedostępne.",
      );
    }
  };
  const googleCall = async () => {
    let resp = await getGoogleLink();
    console.log(resp);
    window.location.replace(resp.url);
  };
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

      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleLogout}
      />
      <p>Alternatywnie:</p>
      <GoogleButton onClick={googleCall} />
    </Box>
  );
};

export default AuthTabs;
