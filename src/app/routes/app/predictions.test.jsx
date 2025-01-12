import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import PredictionsPage from "./predictions";
import ThemeWrapper from "@/testing/theme-wrapper";
import * as usePlayersHook from "@/features/search/api/search-players";
import * as useMaxWeekHook from "@/features/search/api/get-max-predictions";

vi.mock("@/features/search/api/search-players");
vi.mock("@/features/search/api/get-max-predictions");
vi.mock("@/features/search/result-table", () => ({
  __esModule: true,
  default: vi.fn(({ startGameweek, endGameweek, players }) => (
    <div data-testid="mock-result-table">
      <p data-testid="start-gameweek">Start Gameweek: {startGameweek}</p>
      <p data-testid="end-gameweek">End Gameweek: {endGameweek}</p>
      <ul data-testid="players-list">
        {players.map((player, index) => (
          <li key={player.id || index} data-testid="player">
            {player.name} - {player.team.name} ({player.position}) -{" "}
            {(player.price / 10).toFixed(1)} mln
          </li>
        ))}
      </ul>
    </div>
  )),
}));

describe("PredictionsPage", () => {
  const mockUseMaxWeek = vi.spyOn(useMaxWeekHook, "useMaxWeek");
  const mockUsePlayers = vi.spyOn(usePlayersHook, "usePlayers");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search form and passes correct props to ResultTable", async () => {
    mockUseMaxWeek.mockReturnValue({
      data: 38,
      isLoading: false,
      error: null,
    });
    mockUsePlayers.mockReturnValue({
      data: {
        players: [
          {
            id: 1,
            name: "Player 1",
            team: { name: "Team A" },
            position: "Goalkeeper",
            price: 50,
            expectedPoints: [1.2, 2.3, 3.4],
            points: [1, 2, 3],
          },
        ],
        totalPages: 3,
      },
      isLoading: false,
      error: null,
    });

    render(<PredictionsPage />, { wrapper: ThemeWrapper });

    expect(screen.getByTestId("mock-result-table")).toBeInTheDocument();

    const players = screen.getAllByTestId("player");
    expect(players).toHaveLength(1);
    expect(players[0]).toHaveTextContent(
      "Player 1 - Team A (Goalkeeper) - 5.0 mln",
    );
  });

  it("renders the loading state initially", () => {
    mockUseMaxWeek.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    mockUsePlayers.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<PredictionsPage />, { wrapper: ThemeWrapper });

    expect(screen.getByText("Ładowanie danych...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("handles pagination changes", async () => {
    mockUseMaxWeek.mockReturnValue({ data: 38, isLoading: false, error: null });
    mockUsePlayers.mockReturnValue({
      data: {
        players: [
          {
            id: 1,
            name: "Player 1",
            team: { name: "Team A" },
            position: "Goalkeeper",
            price: 50,
            expectedPoints: [1.2, 2.3, 3.4],
            points: [1, 2, 3],
          },
        ],
        totalPages: 3,
      },
      isLoading: false,
      error: null,
    });

    render(<PredictionsPage />, { wrapper: ThemeWrapper });

    const pageTwoButton = screen.getByRole("button", { name: /page 2/i });
    fireEvent.click(pageTwoButton);

    await waitFor(() => {
      expect(mockUsePlayers).toHaveBeenCalledWith(
        expect.objectContaining({
          pageNumber: 1,
        }),
        expect.anything(),
      );
    });
  });

  it("renders 'Brak rezultatów' when there are no players", async () => {
    mockUseMaxWeek.mockReturnValue({ data: 38, isLoading: false, error: null });
    mockUsePlayers.mockReturnValue({
      data: { players: [], totalPages: 0 },
      isLoading: false,
      error: null,
    });

    render(<PredictionsPage />, { wrapper: ThemeWrapper });

    expect(screen.getByText("Brak rezultatów")).toBeInTheDocument();
  });
});
