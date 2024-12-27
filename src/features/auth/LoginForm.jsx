import { useState, React } from "react";
import { Box, Button, Stack, Input, Tabs } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";

import Logo from "@/components/ui/logo";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState("login");

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const onLoginSubmit = (data) => {
    console.log("Logowanie:", data);
    // Fetch do endpointa logowania
    // fetch('/api/login', { method: 'POST', body: JSON.stringify(data) })
  };

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm();

  const onRegisterSubmit = (data) => {
    console.log("Rejestracja:", data);
    // Fetch do endpointa rejestracji
    // fetch('/api/register', { method: 'POST', body: JSON.stringify(data) })
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
          <Tabs.Trigger value="login">Zaloguj się</Tabs.Trigger>
          <Tabs.Trigger value="register">Zarejestruj się</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login">
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <Stack spacing={4}>
              <Field
                label="Adres e-mail"
                invalid={!!loginErrors.email}
                errorText={loginErrors.email?.message}
              >
                <Input
                  border="1px solid"
                  borderColor="gray.400"
                  {...loginRegister("email", {
                    required: "Adres e-mail jest wymagany",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Nieprawidłowy adres e-mail",
                    },
                  })}
                />
              </Field>

              <Field
                label="Hasło"
                invalid={!!loginErrors.password}
                errorText={loginErrors.password?.message}
              >
                <PasswordInput
                  border="1px solid"
                  borderColor="gray.400"
                  {...loginRegister("password", {
                    required: "Hasło jest wymagane",
                  })}
                />
              </Field>

              <Button type="submit" colorPalette="green" width="full" mt={5}>
                Zaloguj się
              </Button>
            </Stack>
          </form>
        </Tabs.Content>

        <Tabs.Content value="register">
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <Stack spacing={4}>
              <Field
                label="Adres e-mail"
                invalid={!!registerErrors.email}
                errorText={registerErrors.email?.message}
              >
                <Input
                  border="1px solid"
                  borderColor="gray.400"
                  {...registerRegister("email", {
                    required: "Adres e-mail jest wymagany",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Nieprawidłowy adres e-mail",
                    },
                  })}
                />
              </Field>

              <Field
                label="Hasło"
                invalid={!!registerErrors.password}
                errorText={registerErrors.password?.message}
              >
                <PasswordInput
                  border="1px solid"
                  borderColor="gray.400"
                  {...registerRegister("password", {
                    required: "Hasło jest wymagane",
                    minLength: {
                      value: 8,
                      message: "Hasło musi mieć co najmniej 8 znaków",
                    },
                  })}
                />
              </Field>

              <Field
                label="ID zespołu"
                invalid={!!registerErrors.teamId}
                errorText={registerErrors.teamId?.message}
              >
                <Input
                  border="1px solid"
                  borderColor="gray.400"
                  {...registerRegister("teamId", {
                    required: "ID zespołu jest wymagane",
                  })}
                />
              </Field>

              <Button type="submit" colorPalette="purple" width="full" mt={5}>
                Zarejestruj się
              </Button>
            </Stack>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default LoginForm;
