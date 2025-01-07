import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import AuthTabs from "./auth-tabs";
import ThemeWrapper from "@/testing/theme-wrapper";

const mockGoToAuth = vi.fn();
const mockGoToSolver = vi.fn();
const mockLogout = vi.fn();

let mockUserData = null;

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useUser: () => ({
      data: mockUserData,
    }),
    useLogout: () => ({
      mutateAsync: mockLogout,
    }),
    useLogin: () => ({
      mutate: vi.fn(),
      isLoading: false,
    }),
    useRegister: () => ({
      mutate: vi.fn(),
      isLoading: false,
    }),
  };
});

vi.mock("@/hooks/use-navigation", () => ({
  useNavigation: () => ({
    goToAuth: mockGoToAuth,
    goToSolver: mockGoToSolver,
  }),
}));

vi.mock("./logout-modal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onConfirm }) => {
    return isOpen ? (
      <div data-testid="mocked-logout-modal">
        <button onClick={onClose}>Wróć do solvera</button>
        <button onClick={onConfirm}>Wyloguj</button>
      </div>
    ) : null;
  },
}));

describe("AuthTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUserData = null;
  });

  it("renders logo and tabs", () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    expect(screen.getByText("MiniFPL")).toBeInTheDocument();
    expect(screen.getByText("Zaloguj się")).toBeInTheDocument();
    expect(screen.getByText("Zarejestruj się")).toBeInTheDocument();
  });

  it("displays login form by default", () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    expect(screen.getByTestId("login-username")).toBeInTheDocument();
  });

  it("switches to registration form when clicking 'Rejestracja'", async () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    await act(async () => {
      fireEvent.click(screen.getByText("Rejestracja"));
    });

    expect(screen.getByTestId("register-username")).toBeInTheDocument();
  });

  it("switches back to login form when clicking 'Logowanie'", async () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    await act(async () => {
      fireEvent.click(screen.getByText("Rejestracja"));
    });
    expect(screen.getByTestId("register-username")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Logowanie"));
    });
    expect(screen.getByTestId("login-username")).toBeInTheDocument();
  });

  it("renders logout modal when user is logged in", async () => {
    mockUserData = { username: "testuser" };

    render(<AuthTabs />, { wrapper: ThemeWrapper });

    expect(screen.getByTestId("mocked-logout-modal")).toBeInTheDocument();
  });

  it("does not render logout modal when user is not logged in", async () => {
    mockUserData = null;

    render(<AuthTabs />, { wrapper: ThemeWrapper });

    expect(screen.queryByTestId("mocked-logout-modal")).not.toBeInTheDocument();
  });

  it("closes modal and navigates to solver when canceled", async () => {
    mockUserData = { username: "testuser" };

    render(<AuthTabs />, { wrapper: ThemeWrapper });

    await act(async () => {
      fireEvent.click(screen.getByText("Wróć do solvera"));
    });

    expect(mockGoToSolver).toHaveBeenCalled();
  });

  it("logs out and navigates to auth page when confirmed", async () => {
    mockUserData = { username: "testuser" };

    render(<AuthTabs />, { wrapper: ThemeWrapper });

    await act(async () => {
      fireEvent.click(screen.getByText("Wyloguj"));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockGoToAuth).toHaveBeenCalled();
  });
});
