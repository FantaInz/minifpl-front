import React, { useState } from "react";
import { Stack, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useRegister, useLogin } from "@/lib/auth";
import { useNavigation } from "@/hooks/use-navigation";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslateError } from "@/utils/translate-error";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  const { t } = useTranslation();
  const { translateError } = useTranslateError();
  const [registerError, setRegisterError] = useState("");
  const [isRegisteringLocal, setIsRegisteringLocal] = useState(false);
  const { goToSolver } = useNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate: registerUser, isLoading: isRegistering } = useRegister();
  const { mutate: login } = useLogin();

  const onSubmit = (data) => {
    setRegisterError("");
    setIsRegisteringLocal(true);

    registerUser(data, {
      onSuccess: () => {
        login(
          { username: data.username, password: data.password },
          {
            onSuccess: () => {
              goToSolver();
            },
            onError: (error) => {
              const translatedError = translateError(
                error.response?.data?.detail || error.message,
              );
              setRegisterError(translatedError);
            },
          },
        );
      },
      onError: (error) => {
        const translatedError = translateError(
          error.response?.data?.detail || error.message,
        );
        setRegisterError(translatedError);
      },
      onSettled: () => {
        setIsRegisteringLocal(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Field
          label={t("registerForm.usernameLabel")}
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            data-testid="register-username"
            border="1px solid"
            borderColor="gray.400"
            {...register("username", {
              required: t("registerForm.usernameRequired"),
              minLength: { value: 3, message: "Min. 3 znaki" },
            })}
          />
        </Field>

        <Field
          label={t("registerForm.emailLabel")}
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input
            data-testid="register-email"
            border="1px solid"
            borderColor="gray.400"
            {...register("email", {
              required: t("registerForm.emailRequired"),
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: t("registerForm.emailInvalid"),
              },
            })}
          />
        </Field>

        <Field
          label={t("registerForm.passwordLabel")}
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            data-testid="register-password"
            border="1px solid"
            borderColor="gray.400"
            {...register("password", {
              required: t("registerForm.passwordRequired"),
              minLength: {
                value: 8,
                message: t("registerForm.passwordMinLength"),
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
          {t("registerForm.submitButton")}
        </Button>
      </Stack>
    </form>
  );
};

export default RegisterForm;
