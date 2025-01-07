import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import NavBar from "./navbar";
import ThemeWrapper from "@/testing/theme-wrapper";
import { paths } from "@/config/paths";

const mockLogout = vi.fn();

vi.mock("@/lib/auth", () => ({
  useLogout: () => ({
    mutateAsync: mockLogout,
  }),
}));

describe("NavBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders logo, links, and logout button", () => {
    render(<NavBar />, { wrapper: ThemeWrapper });

    expect(screen.getByTestId("nav-solver-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("nav-twoje plany-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("nav-predykcje-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("logo-icon")).toBeInTheDocument();
    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
  });

  it("navigates to correct paths", () => {
    render(<NavBar />, { wrapper: ThemeWrapper });

    expect(
      screen.getByTestId("nav-solver-desktop").closest("a"),
    ).toHaveAttribute("href", paths.app.solver.path);
    expect(
      screen.getByTestId("nav-twoje plany-desktop").closest("a"),
    ).toHaveAttribute("href", paths.app.plans.path);
    expect(
      screen.getByTestId("nav-predykcje-desktop").closest("a"),
    ).toHaveAttribute("href", paths.app.predictions.path);
  });

  it("logs out when clicking the logout button", async () => {
    render(<NavBar />, { wrapper: ThemeWrapper });

    const logoutButton = screen.getByTestId("logout-button");

    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});
