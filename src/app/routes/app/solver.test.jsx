import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SolverPage from "./solver";
import ThemeWrapper from "@/testing/theme-wrapper";

const mockSetQueryData = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      setQueryData: mockSetQueryData,
    }),
  };
});

let mockUserData = { squad_id: null };

vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useUser: () => ({
      data: mockUserData,
      isLoading: false,
    }),
  };
});

const mockSquadData = {
  lastUpdate: 1,
  players: [
    {
      id: 1,
      name: "Player 1",
      points: 5,
      expectedPoints: [3.4567, 4.5678],
    },
    {
      id: 2,
      name: "Player 2",
      points: 6,
      expectedPoints: [4.1234, 5.3456],
    },
  ],
  freeTransfers: 2,
  transferBudget: 1000,
};

vi.mock("@/features/solver/api/get-squad", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useSquad: (teamId) => ({
      data: teamId ? mockSquadData : null,
      isLoading: false,
    }),
  };
});

vi.mock("@/components/ui/pitch", () => ({
  __esModule: true,
  default: ({ players, gameweek }) => (
    <div data-testid="mock-pitch">
      <p>Gameweek: {gameweek}</p>
      {players.map((player) => (
        <p key={player.id}>{player.name}</p>
      ))}
    </div>
  ),
}));

vi.mock("@/features/solver/solver-form", () => ({
  __esModule: true,
  default: ({ freeTransfers, budget, teamId, onSubmit }) => (
    <div data-testid="mock-form">
      <p>Free Transfers: {freeTransfers}</p>
      <p>Budget: {budget}</p>
      <p>Team ID: {teamId}</p>
      <button
        data-testid="submit-button"
        onClick={() => onSubmit({ planName: "My Plan" })}
      >
        Submit
      </button>
    </div>
  ),
}));

vi.mock("@/features/solver/team-modal", () => ({
  __esModule: true,
  default: ({ isOpen, onSubmit }) => {
    return isOpen ? (
      <div data-testid="mock-modal">
        <input data-testid="team-id-input" />
        <button data-testid="modal-submit" onClick={() => onSubmit("12345")}>
          Zapisz
        </button>
      </div>
    ) : null;
  },
}));

describe("SolverPage", () => {
  let queryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();
  });

  const renderWithProviders = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <SolverPage />
      </QueryClientProvider>,
      { wrapper: ThemeWrapper },
    );

  it("opens modal if user has no squad_id", async () => {
    mockUserData.squad_id = null;

    renderWithProviders();

    const modal = await screen.findByTestId("mock-modal");
    expect(modal).toBeInTheDocument();
  });

  it("does not open modal if user has squad_id", async () => {
    mockUserData.squad_id = "12345";

    renderWithProviders();

    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("closes modal and updates squad_id after submitting a valid team ID", async () => {
    mockUserData.squad_id = null;

    renderWithProviders();

    const modal = await screen.findByTestId("mock-modal");
    expect(modal).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("modal-submit"));
    });

    expect(mockSetQueryData).toHaveBeenCalledWith(
      ["authenticated-user"],
      expect.any(Function),
    );
  });

  it("renders squad data in Pitch component", async () => {
    mockUserData.squad_id = "12345";

    renderWithProviders();

    await screen.findByTestId("mock-pitch");

    expect(screen.getByText("Gameweek: 1")).toBeInTheDocument();
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("Player 2")).toBeInTheDocument();
  });

  it("renders form data in SolverForm component", async () => {
    mockUserData.squad_id = "12345";

    renderWithProviders();

    await screen.findByTestId("mock-form");

    expect(screen.getByText("Free Transfers: 2")).toBeInTheDocument();
    expect(screen.getByText("Budget: 100")).toBeInTheDocument();
    expect(screen.getByText("Team ID: 12345")).toBeInTheDocument();
  });
});
