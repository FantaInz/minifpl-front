import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

import { ThemeWrapper } from "@/testing/theme-wrapper";
import { MainErrorFallback } from "../main-error-fallback";

describe("MainErrorFallback", () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("renders the error message", () => {
    render(<MainErrorFallback />, { wrapper: ThemeWrapper });
    expect(screen.getByText("Coś poszło nie tak 😢")).toBeInTheDocument();
  });

  it("renders the error message", () => {
    render(<MainErrorFallback />, { wrapper: ThemeWrapper });
    fireEvent.click(screen.getByRole("button", { name: /Odśwież aplikację/i }));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
