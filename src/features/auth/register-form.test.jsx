import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import RegisterForm from "./register-form";
import ThemeWrapper from "@/testing/theme-wrapper";

const mockRegister = vi.fn();
const mockLogin = vi.fn();
const mockGoToSolver = vi.fn();

vi.mock("@/lib/auth", () => ({
  useRegister: () => ({
    mutate: mockRegister,
    isLoading: false,
  }),
  useLogin: () => ({
    mutate: mockLogin,
    isLoading: false,
  }),
}));

vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: () => ({
    goToSolver: mockGoToSolver,
  }),
}));

vi.mock("@/utils/translate-error", () => ({
  translateError: (error) => {
    const errorMap = {
      "User with this username or email already exists":
        "Użytkownik z tą nazwą użytkownika lub adresem e-mail już istnieje.",
    };

    return errorMap[error] || "Wystąpił błąd. Spróbuj ponownie później.";
  },
}));

describe("RegisterForm", () => {
  it("displays validation errors on empty form submission", async () => {
    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    expect(
      await screen.findByText("Nazwa użytkownika jest wymagana"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Adres e-mail jest wymagany"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Hasło jest wymagane")).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("register-username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByTestId("register-email"), {
      target: { value: "email@example.com" },
    });
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        {
          username: "newuser",
          email: "email@example.com",
          password: "password123",
        },
        expect.anything(),
      );
    });
  });

  it("logs in after successful registration", async () => {
    mockRegister.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    mockLogin.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("register-username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByTestId("register-email"), {
      target: { value: "email@example.com" },
    });
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { username: "newuser", password: "password123" },
        expect.anything(),
      );
    });
  });

  it("redirects to solver after successful registration and login", async () => {
    mockRegister.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    mockLogin.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("register-username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByTestId("register-email"), {
      target: { value: "email@example.com" },
    });
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    await waitFor(() => {
      expect(mockGoToSolver).toHaveBeenCalled();
    });
  });

  it("displays error message when username is already taken", async () => {
    mockRegister.mockImplementation((data, { onError }) => {
      if (data.username === "takenuser") {
        onError({
          response: {
            data: {
              detail: "User with this username or email already exists",
            },
          },
        });
      }
    });

    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("register-username"), {
      target: { value: "takenuser" },
    });
    fireEvent.change(screen.getByTestId("register-email"), {
      target: { value: "email@example.com" },
    });
    fireEvent.change(screen.getByTestId("register-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Użytkownik z tą nazwą użytkownika lub adresem e-mail już istnieje.",
        ),
      ).toBeInTheDocument();
    });
  });
});
