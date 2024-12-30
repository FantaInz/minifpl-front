import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import AuthTabs from "./auth-tabs";
import ThemeWrapper from "@/testing/theme-wrapper";

describe("AuthTabs", () => {
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

  it("switches to registration form when clicking 'Zarejestruj się'", () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByText("Zarejestruj się"));

    expect(screen.getByTestId("register-username")).toBeInTheDocument();
  });

  it("switches back to login form when clicking 'Zaloguj się'", () => {
    render(<AuthTabs />, { wrapper: ThemeWrapper });

    fireEvent.click(screen.getByText("Zarejestruj się"));
    expect(screen.getByTestId("register-username")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Zaloguj się"));
    expect(screen.getByTestId("login-username")).toBeInTheDocument();
  });
});
