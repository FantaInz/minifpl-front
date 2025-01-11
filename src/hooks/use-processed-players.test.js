import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useProcessedPlayers from "@/hooks/use-processed-players";

const mockPlanDetails = {
  start_gameweek: 1,
  squads: [
    {
      team: [
        {
          id: 1,
          name: "Player 1",
          expectedPoints: [4.5, 5],
        },
        {
          id: 2,
          name: "Player 2",
          expectedPoints: [3.2, 2.8],
        },
      ],
      subs: [
        {
          id: 3,
          name: "Player 3",
          expectedPoints: [1.1, 2],
        },
        {
          id: 4,
          name: "Player 4",
          expectedPoints: [0.5, 1],
        },
      ],
    },
    {
      team: [
        {
          id: 5,
          name: "Player 5",
          expectedPoints: [1, 0.8],
        },
      ],
      subs: [
        {
          id: 6,
          name: "Player 6",
          expectedPoints: [2, 3.5],
        },
        {
          id: 7,
          name: "Player 7",
          expectedPoints: [0.5, 0.3],
        },
      ],
    },
  ],
};

describe("useProcessedPlayers", () => {
  it("returns an empty array when no planDetails or selectedGameweek is provided", () => {
    const { result } = renderHook(() => useProcessedPlayers(null, null));
    expect(result.current).toEqual([]);
  });

  it("returns processed players when valid planDetails and selectedGameweek are provided", () => {
    const selectedGameweek = 1;

    const { result } = renderHook(() =>
      useProcessedPlayers(mockPlanDetails, selectedGameweek),
    );

    expect(result.current).toEqual([
      {
        id: 1,
        name: "Player 1",
        expectedPoints: [4.5, 5],
      },
      {
        id: 2,
        name: "Player 2",
        expectedPoints: [3.2, 2.8],
      },
      {
        id: 4,
        name: "Player 4",
        expectedPoints: [0.5, 1],
      },
      {
        id: 3,
        name: "Player 3",
        expectedPoints: [1.1, 2],
      },
    ]);
  });

  it("sorts substitutes correctly based on expectedPoints", () => {
    const selectedGameweek = 2;

    const { result } = renderHook(() =>
      useProcessedPlayers(mockPlanDetails, selectedGameweek),
    );

    expect(result.current).toEqual([
      {
        id: 5,
        name: "Player 5",
        expectedPoints: [1, 0.8],
      },
      {
        id: 7,
        name: "Player 7",
        expectedPoints: [0.5, 0.3],
      },
      {
        id: 6,
        name: "Player 6",
        expectedPoints: [2, 3.5],
      },
    ]);
  });
});
