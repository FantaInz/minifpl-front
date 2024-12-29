import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import LoginForm from "./login-form";
import ThemeWrapper from "@/testing/theme-wrapper";

const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock("@/lib/auth", () => ({
  useLogin: () => ({
    mutate: mockLogin,
    isLoading: false,
  }),
  useRegister: () => ({
    mutate: mockRegister,
    isLoading: false,
  }),
}));

vi.mock("@/utils/translate-error", () => ({
  translateError: (error) => {
    const errorMap = {
      "Incorrect username or password":
        "Nieprawidłowa nazwa użytkownika lub hasło.",
      "User with this username or email already exists":
        "Użytkownik z tą nazwą użytkownika lub adresem e-mail już istnieje.",
    };

    return errorMap[error] || "Wystąpił błąd. Spróbuj ponownie później.";
  },
}));

describe("LoginForm", () => {
  it("renders login and register tabs", () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });
    expect(screen.getByText("Logowanie")).toBeInTheDocument();
    expect(screen.getByText("Rejestracja")).toBeInTheDocument();
  });

  it("displays validation errors on empty login form submission", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

    expect(
      await screen.findByText("Nazwa użytkownika jest wymagana"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Hasło jest wymagane")).toBeInTheDocument();
  });

  it("submits login form with valid data", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("login-username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { username: "testuser", password: "password123" },
        expect.anything(),
      );
    });
  });

  it("displays error message on invalid login", async () => {
    mockLogin.mockImplementation((data, { onError }) => {
      if (data.username === "invaliduser") {
        onError({
          response: { data: { detail: "Incorrect username or password" } },
        });
      }
    });

    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("login-username"), {
      target: { value: "invaliduser" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));

    await waitFor(() => {
      expect(
        screen.getByText("Nieprawidłowa nazwa użytkownika lub hasło."),
      ).toBeInTheDocument();
    });
  });

  it("displays validation errors on empty registration form submission", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByRole("tab", { name: "Rejestracja" }));

    await waitFor(() => {
      expect(screen.getByTestId("register-login")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Zarejestruj się" }));

    expect(
      await screen.findByText("Nazwa użytkownika jest wymagana"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Adres e-mail jest wymagany"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Hasło jest wymagane")).toBeInTheDocument();
  });

  it("submits registration form with valid data", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByRole("tab", { name: "Rejestracja" }));

    await waitFor(() => {
      expect(screen.getByTestId("register-login")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("register-login"), {
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

  it("displays error message on registration with taken username", async () => {
    mockRegister.mockImplementation((data, { onError }) => {
      if (data.username === "takenuser") {
        onError({
          response: {
            data: { detail: "User with this username or email already exists" },
          },
        });
      }
    });

    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByRole("tab", { name: "Rejestracja" }));

    await waitFor(() => {
      expect(screen.getByTestId("register-login")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("register-login"), {
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
