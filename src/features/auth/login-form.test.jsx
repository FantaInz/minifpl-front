import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import LoginForm from "./login-form";
import ThemeWrapper from "@/testing/theme-wrapper";

const mockLogin = vi.fn();
const mockGoToSolver = vi.fn();

vi.mock("@/lib/auth", () => ({
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
  useTranslateError: () => ({
    translateError: (error) => {
      const errorMap = {
        "Incorrect username or password":
          "Nieprawidłowa nazwa użytkownika lub hasło.",
      };

      return errorMap[error] || "Wystąpił błąd. Spróbuj ponownie później.";
    },
  }),
}));

describe("LoginForm", () => {
  it("renders login form", () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    expect(
      screen.getByLabelText("loginForm.usernameLabel"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("loginForm.passwordLabel"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "loginForm.submitButton" }),
    ).toBeInTheDocument();
  });

  it("displays validation errors on empty submission", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.click(
      screen.getByRole("button", { name: "loginForm.submitButton" }),
    );

    expect(
      await screen.findByText("loginForm.usernameRequired"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("loginForm.passwordRequired"),
    ).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("login-username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "loginForm.submitButton" }),
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { username: "testuser", password: "password123" },
        expect.anything(),
      );
    });
  });

  it("navigates to solver on successful login", async () => {
    mockLogin.mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });

    render(<LoginForm />, { wrapper: ThemeWrapper });

    fireEvent.change(screen.getByTestId("login-username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByTestId("login-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "loginForm.submitButton" }),
    );

    await waitFor(() => {
      expect(mockGoToSolver).toHaveBeenCalled();
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

    fireEvent.click(
      screen.getByRole("button", { name: "loginForm.submitButton" }),
    );

    await waitFor(() => {
      expect(
        screen.getByText("Nieprawidłowa nazwa użytkownika lub hasło."),
      ).toBeInTheDocument();
    });
  });
});
