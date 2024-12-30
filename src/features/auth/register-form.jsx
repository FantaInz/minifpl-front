import React, { useState } from "react";
import { Stack, Input, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useRegister, useLogin } from "@/lib/auth";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { translateError } from "@/utils/translate-error";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  const [registerError, setRegisterError] = useState("");
  const [isRegisteringLocal, setIsRegisteringLocal] = useState(false);

  const navigate = useNavigate();
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <Field
          label="Nazwa użytkownika"
          invalid={!!errors.username}
          errorText={errors.username?.message}
        >
          <Input
            data-testid="register-username"
            border="1px solid"
            borderColor="gray.400"
            {...register("username", {
              required: "Nazwa użytkownika jest wymagana",
              minLength: { value: 3, message: "Min. 3 znaki" },
            })}
          />
        </Field>

        <Field
          label="Adres e-mail"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          <Input
            data-testid="register-email"
            border="1px solid"
            borderColor="gray.400"
            {...register("email", {
              required: "Adres e-mail jest wymagany",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Nieprawidłowy e-mail",
              },
            })}
          />
        </Field>

        <Field
          label="Hasło"
          invalid={!!errors.password}
          errorText={errors.password?.message}
        >
          <PasswordInput
            data-testid="register-password"
            border="1px solid"
            borderColor="gray.400"
            {...register("password", {
              required: "Hasło jest wymagane",
              minLength: { value: 8, message: "Min. 8 znaków" },
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
  );
};

export default RegisterForm;
