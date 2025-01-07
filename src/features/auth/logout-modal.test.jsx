import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import LogoutModal from "./logout-modal";
import ThemeWrapper from "@/testing/theme-wrapper";

describe("LogoutModal", () => {
  const mockOnConfirm = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(
      <LogoutModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    expect(screen.getByText("Zakończenie sesji")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Jesteś obecnie zalogowany. Czy na pewno chcesz się wylogować?",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Wróć do solvera")).toBeInTheDocument();
    expect(screen.getByText("Wyloguj się")).toBeInTheDocument();
  });

  it("does not render modal when closed", () => {
    render(
      <LogoutModal
        isOpen={false}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    expect(screen.queryByText("Zakończenie sesji")).not.toBeInTheDocument();
  });

  it("calls onClose when 'Wróć do solvera' is clicked", async () => {
    render(
      <LogoutModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Wróć do solvera"));
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onConfirm when 'Wyloguj się' is clicked", async () => {
    render(
      <LogoutModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Wyloguj się"));
    });

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
