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

    expect(screen.getByText("logoutModal.title")).toBeInTheDocument();
    expect(screen.getByText("logoutModal.body")).toBeInTheDocument();

    expect(screen.getByText("logoutModal.returnButton")).toBeInTheDocument();
    expect(screen.getByText("buttons.logout")).toBeInTheDocument();
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

    expect(screen.queryByText("logoutModal.title")).not.toBeInTheDocument();
  });

  it("calls onClose when 'logoutModal.returnButton' is clicked", async () => {
    render(
      <LogoutModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    await act(async () => {
      fireEvent.click(screen.getByText("logoutModal.returnButton"));
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onConfirm when 'buttons.logout' is clicked", async () => {
    render(
      <LogoutModal
        isOpen={true}
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />,
      { wrapper: ThemeWrapper },
    );

    await act(async () => {
      fireEvent.click(screen.getByText("buttons.logout"));
    });

    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
