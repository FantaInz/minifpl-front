const useProcessedPlayers = (planDetails, selectedGameweek) => {
  if (!planDetails || !selectedGameweek) return [];

  const currentSquad =
    planDetails.squads?.[selectedGameweek - planDetails.start_gameweek];

  if (!currentSquad) return [];

  const reversedSubs = [...(currentSquad.subs || [])].reverse();
  const sortedSubs =
    reversedSubs.length > 0
      ? [
          reversedSubs[0],
          ...reversedSubs
            .slice(1)
            .sort(
              (a, b) =>
                b.expectedPoints[selectedGameweek - 1] -
                a.expectedPoints[selectedGameweek - 1],
            ),
        ]
      : [];

  const players = [...(currentSquad.team || []), ...sortedSubs];
  return players.map((player) => ({
    ...player,
    expectedPoints: player.expectedPoints.map((point) =>
      Number(parseFloat(point).toFixed(2)),
    ),
  }));
};

export default useProcessedPlayers;
