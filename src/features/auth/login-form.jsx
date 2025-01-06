import React, { useState } from "react";
import { Stack, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { useLogin } from "@/lib/auth";
import { useNavigation } from "@/hooks/use-navigation";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { translateError } from "@/utils/translate-error";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const [loginError, setLoginError] = useState("");
  const [isLoggingInLocal, setIsLoggingInLocal] = useState(false);
  const { goToSolver } = useNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate: login, isLoading: isLoggingIn } = useLogin();

  const onSubmit = (data) => {
    setLoginError("");
    setIsLoggingInLocal(true);

    login(data, {
      onSuccess: () => {
        console.log("Zalogowano pomyślnie!");
        goToSolver();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Field
          label="Nazwa użytkownika"
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            data-testid="login-username"
            border="1px solid"
            borderColor="gray.400"
            {...register("username", {
              required: "Nazwa użytkownika jest wymagana",
            })}
          />
        </Field>

        <Field
          label="Hasło"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            data-testid="login-password"
            border="1px solid"
            borderColor="gray.400"
            {...register("password", {
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
  );
};

export default LoginForm;
