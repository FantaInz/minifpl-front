import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResultTable from "./result-table";
import ThemeWrapper from "@/testing/theme-wrapper";

describe("ResultTable", () => {
  const mockPlayers = [
    {
      id: 1,
      name: "Player 1",
      team: { name: "Team A" },
      position: "Goalkeeper",
      price: 50,
      expectedPoints: [1.2, 2.3, 3.4],
      points: [1, 2, 3],
    },
    {
      id: 2,
      name: "Player 2",
      team: { name: "Team B" },
      position: "Defender",
      price: 45,
      expectedPoints: [4.5, 5.6],
      points: [4, 5],
    },
  ];

  it("renders the table with headers and data", () => {
    render(
      <ResultTable startGameweek={1} endGameweek={3} players={mockPlayers} />,
      { wrapper: ThemeWrapper },
    );

    expect(screen.getByText("resultTable.player")).toBeInTheDocument();
    expect(screen.getByText("resultTable.team")).toBeInTheDocument();
    expect(screen.getByText("resultTable.position")).toBeInTheDocument();
    expect(screen.getByText("resultTable.price")).toBeInTheDocument();
    expect(screen.getByText("resultTable.availability")).toBeInTheDocument();

    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Goalkeeper")).toBeInTheDocument();
    expect(screen.getByText("5.0")).toBeInTheDocument();
    expect(screen.getByText("1.20")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles missing points and expected points gracefully", () => {
    const incompletePlayers = [
      {
        id: 1,
        name: "Player 3",
        team: { name: "Team C" },
        position: "Midfielder",
        availability: 50,
        price: 60,
        expectedPoints: [undefined, 6.5],
        points: [undefined, 6],
      },
    ];

    render(
      <ResultTable
        startGameweek={1}
        endGameweek={2}
        players={incompletePlayers}
      />,
      { wrapper: ThemeWrapper },
    );

    expect(screen.getByText("Player 3")).toBeInTheDocument();
    expect(screen.getByText("Team C")).toBeInTheDocument();
    expect(screen.getByText("Midfielder")).toBeInTheDocument();
    expect(screen.getByText("6.0")).toBeInTheDocument();
    expect(screen.getAllByText("resultTable.noData")).toHaveLength(2);
    expect(screen.getByText("6.50")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders 'resultTable.noResults' when players array is empty", () => {
    render(<ResultTable startGameweek={1} endGameweek={3} players={[]} />, {
      wrapper: ThemeWrapper,
    });

    expect(screen.getByText("resultTable.noResults")).toBeInTheDocument();
  });
});
