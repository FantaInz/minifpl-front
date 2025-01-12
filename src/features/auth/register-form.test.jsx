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

vi.mock("@/utils/translate-error", async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    useTranslateError: () => ({
      translateError: (error) => {
        const errorMap = {
          "User with this username or email already exists":
            "errors.userExists",
        };

        return errorMap[error] || "errors.unknownError";
      },
      translateErrorSolver: (message) => {
        if (
          message ===
          "Optimization failed, probably due to unfeasible constraints"
        ) {
          return "errors.optimizationFailed";
        }
        return "errors.defaultSolverError";
      },
    }),
  };
});

describe("RegisterForm", () => {
  it("displays validation errors on empty form submission", async () => {
    render(<RegisterForm />, { wrapper: ThemeWrapper });

    fireEvent.click(
      screen.getByRole("button", { name: "registerForm.submitButton" }),
    );

    expect(
      await screen.findByText("registerForm.usernameRequired"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("registerForm.emailRequired"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("registerForm.passwordRequired"),
    ).toBeInTheDocument();
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

    fireEvent.click(
      screen.getByRole("button", { name: "registerForm.submitButton" }),
    );

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

    fireEvent.click(
      screen.getByRole("button", { name: "registerForm.submitButton" }),
    );

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

    fireEvent.click(
      screen.getByRole("button", { name: "registerForm.submitButton" }),
    );

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

    fireEvent.click(
      screen.getByRole("button", { name: "registerForm.submitButton" }),
    );

    await waitFor(() => {
      expect(screen.getByText("errors.userExists")).toBeInTheDocument();
    });
  });
});
