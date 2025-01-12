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

    expect(screen.getByText("Piłkarz")).toBeInTheDocument();
    expect(screen.getByText("Drużyna")).toBeInTheDocument();
    expect(screen.getByText("Pozycja")).toBeInTheDocument();
    expect(screen.getByText("Cena")).toBeInTheDocument();
    expect(screen.getByText("Przew. GW1")).toBeInTheDocument();
    expect(screen.getByText("Zdob. GW1")).toBeInTheDocument();
    expect(screen.getByText("Przew. GW3")).toBeInTheDocument();
    expect(screen.getByText("Zdob. GW3")).toBeInTheDocument();

    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Team A")).toBeInTheDocument();
    expect(screen.getByText("Bramkarz")).toBeInTheDocument();
    expect(screen.getByText("5.0")).toBeInTheDocument();
    expect(screen.getByText("1.20")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    expect(screen.getByText("Player 2")).toBeInTheDocument();
    expect(screen.getByText("Team B")).toBeInTheDocument();
    expect(screen.getByText("Obrońca")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("4.50")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("handles missing points and expected points gracefully", () => {
    const incompletePlayers = [
      {
        id: 1,
        name: "Player 3",
        team: { name: "Team C" },
        position: "Midfielder",
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
    expect(screen.getByText("Pomocnik")).toBeInTheDocument();
    expect(screen.getByText("6.0")).toBeInTheDocument();
    expect(screen.getAllByText("??")).toHaveLength(2);
    expect(screen.getByText("6.50")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("renders 'Brak wyników' when players array is empty", () => {
    render(<ResultTable startGameweek={1} endGameweek={3} players={[]} />, {
      wrapper: ThemeWrapper,
    });

    expect(screen.getByText("Brak wyników")).toBeInTheDocument();
  });
});
