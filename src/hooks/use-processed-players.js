const useProcessedPlayers = (planDetails, selectedGameweek) => {
  if (!planDetails || !selectedGameweek) return [];

  const currentSquad =
    planDetails.squads?.[selectedGameweek - planDetails.start_gameweek];

  if (!currentSquad) return [];

  const subs = currentSquad.subs || [];
  const goalkeeper = subs.find((player) => player.position === "Goalkeeper");
  const outfieldPlayers = subs
    .filter((player) => player.position !== "Goalkeeper")
    .sort(
      (a, b) =>
        b.expectedPoints[selectedGameweek - 1] -
        a.expectedPoints[selectedGameweek - 1],
    );

  const sortedSubs = [goalkeeper, ...outfieldPlayers];

  const players = [...(currentSquad.team || []), ...sortedSubs];

  return players.map((player) => ({
    ...player,
    expectedPoints: player.expectedPoints.map((point) =>
      Number(parseFloat(point).toFixed(2)),
    ),
  }));
};

export default useProcessedPlayers;
