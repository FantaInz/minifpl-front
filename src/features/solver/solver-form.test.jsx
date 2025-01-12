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
      data: mockPlayers,
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

    expect(screen.getByLabelText(/Nazwa planu/i)).toBeInTheDocument();
    expect(screen.getByText(/ID zespołu/i)).toBeInTheDocument();
    expect(screen.getByText(/Nazwa zespołu/i)).toBeInTheDocument();
    expect(screen.getByText(/W banku/i)).toBeInTheDocument();
    expect(screen.getByText(/Dostępne transfery/i)).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: "Uruchom" }));

    expect(
      await screen.findByText("Nazwa planu jest wymagana"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Wybierz liczbę kolejek", { selector: "span" }),
    ).toBeInTheDocument();
  });
});
