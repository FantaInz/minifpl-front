import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SolverForm from "./solver-form";
import ThemeWrapper from "@/testing/theme-wrapper";
import { usePlayers } from "@/features/search/api/search-players";

vi.mock("@/features/search/api/search-players");

describe("SolverForm", () => {
  const mockOnSubmit = vi.fn();

  const mockPlayers = [
    { id: 1, name: "Player A" },
    { id: 2, name: "Player B" },
    { id: 3, name: "Player C" },
  ];

  beforeEach(() => {
    usePlayers.mockReturnValue({
      data: { players: mockPlayers },
    });
  });

  it("renders with initial fields and data", () => {
    render(
      <SolverForm
        freeTransfers={2}
        budget={100}
        teamId={123}
        teamName="Test Team"
        onSubmit={mockOnSubmit}
      />,
      { wrapper: ThemeWrapper },
    );

    expect(screen.getByLabelText("solverForm.planName")).toBeInTheDocument();
    expect(screen.getByText("solverForm.teamId")).toBeInTheDocument();
    expect(screen.getByText("solverForm.teamName")).toBeInTheDocument();
    expect(screen.getByText("solverForm.budget")).toBeInTheDocument();
    expect(screen.getByText("solverForm.freeTransfers")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(
      <SolverForm
        freeTransfers={2}
        budget={100}
        teamId={123}
        teamName="Test Team"
        onSubmit={mockOnSubmit}
      />,
      { wrapper: ThemeWrapper },
    );

    fireEvent.click(
      screen.getByRole("button", { name: "solverForm.submitButton" }),
    );

    expect(
      await screen.findByText("solverForm.planNameRequired"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("solverForm.gameweeksRequired"),
    ).toBeInTheDocument();
  });
});
