import React, { useState } from "react";
import { Stack, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useLogin } from "@/lib/auth";
import { useNavigation } from "@/hooks/use-navigation";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslateError } from "@/utils/translate-error";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const { t } = useTranslation();
  const { translateError } = useTranslateError();
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
        goToSolver();
      },
      onError: (error) => {
        const translatedError = translateError(
          error.response?.data?.detail || error.message,
        );
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
          label={t("loginForm.usernameLabel")}
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            data-testid="login-username"
            border="1px solid"
            borderColor="gray.400"
            {...register("username", {
              required: t("loginForm.usernameRequired"),
            })}
          />
        </Field>

        <Field
          label={t("loginForm.passwordLabel")}
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            data-testid="login-password"
            border="1px solid"
            borderColor="gray.400"
            {...register("password", {
              required: t("loginForm.passwordRequired"),
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
          {t("loginForm.submitButton")}
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
