import { useState, React } from "react";
import { Box, Stack, Input, Tabs, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useLogin, useRegister } from "@/lib/auth";
import Logo from "@/components/ui/logo";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { translateError } from "@/utils/translate-error";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isLoggingInLocal, setIsLoggingInLocal] = useState(false);
  const [isRegisteringLocal, setIsRegisteringLocal] = useState(false);

  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm();

  const { mutate: login, isLoading: isLoggingIn } = useLogin();

  const onLoginSubmit = (data) => {
    setLoginError("");
    setIsLoggingInLocal(true);

    login(data, {
      onSuccess: () => {
        console.log("Zalogowano pomyślnie!");
        navigate("/solver");
      },
      onError: (error) => {
        const translatedError = translateError(
          error.response?.data?.detail || error.message,
        );
        console.error("Błąd logowania:", translatedError);
        setLoginError(translatedError);
      },
      onSettled: () => {
        setIsLoggingInLocal(false);
      },
    });
  };

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm();

  const { mutate: register, isLoading: isRegistering } = useRegister();

  const onRegisterSubmit = (data) => {
    setRegisterError("");
    setIsRegisteringLocal(true);

    register(data, {
      onSuccess: () => {
        console.log("Zarejestrowano pomyślnie!");
        login(
          { username: data.username, password: data.password },
          {
            onSuccess: () => {
              console.log("Zalogowano po rejestracji!");
              navigate("/solver");
            },
            onError: (error) => {
              const translatedError = translateError(
                error.response?.data?.detail || error.message,
              );
              console.error("Błąd logowania po rejestracji:", translatedError);
              setRegisterError(translatedError);
            },
            onSettled: () => {
              setIsRegisteringLocal(false);
            },
          },
        );
      },
      onError: (error) => {
        const translatedError = translateError(
          error.response?.data?.detail || error.message,
        );
        console.error("Błąd rejestracji:", translatedError);
        setRegisterError(translatedError);
      },
      onSettled: () => {
        setIsRegisteringLocal(false);
      },
    });
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
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <Stack spacing={4}>
              <Field
                label="Nazwa użytkownika"
                invalid={!!loginErrors.username}
                errorText={loginErrors.username?.message}
              >
                <Input
                  data-testid="login-username"
                  border="1px solid"
                  borderColor="gray.400"
                  {...loginRegister("username", {
                    required: "Nazwa użytkownika jest wymagana",
                  })}
                />
              </Field>

              <Field
                label="Hasło"
                invalid={!!loginErrors.password}
                errorText={loginErrors.password?.message}
              >
                <PasswordInput
                  data-testid="login-password"
                  border="1px solid"
                  borderColor="gray.400"
                  {...loginRegister("password", {
                    required: "Hasło jest wymagane",
                  })}
                />
              </Field>

              {loginError && <Text color="red.500">{loginError}</Text>}

              <Button
                type="submit"
                colorPalette="green"
                width="full"
                mt={5}
                loading={isLoggingIn || isLoggingInLocal}
              >
                Zaloguj się
              </Button>
            </Stack>
          </form>
        </Tabs.Content>

        <Tabs.Content value="register">
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <Stack spacing={4}>
              <Field
                label="Nazwa użytkownika"
                invalid={!!registerErrors.username}
                errorText={registerErrors.username?.message}
              >
                <Input
                  data-testid="register-login"
                  border="1px solid"
                  borderColor="gray.400"
                  {...registerRegister("username", {
                    required: "Nazwa użytkownika jest wymagana",
                    minLength: {
                      value: 3,
                      message:
                        "Nazwa użytkownika musi mieć co najmniej 3 znaki",
                    },
                  })}
                />
              </Field>
              <Field
                label="Adres e-mail"
                invalid={!!registerErrors.email}
                errorText={registerErrors.email?.message}
              >
                <Input
                  data-testid="register-email"
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
                  data-testid="register-password"
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

              {registerError && <Text color="red.500">{registerError}</Text>}

              <Button
                type="submit"
                colorPalette="purple"
                width="full"
                mt={5}
                loading={isRegistering || isRegisteringLocal}
              >
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
