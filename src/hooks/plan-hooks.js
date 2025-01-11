export const useGameweeks = (planDetails) => {
  if (
    !planDetails ||
    !planDetails.start_gameweek ||
    !planDetails.end_gameweek
  ) {
    return [];
  }

  return Array.from(
    {
      length: planDetails.end_gameweek - planDetails.start_gameweek + 1,
    },
    (_, i) => {
      const gw = planDetails.start_gameweek + i;
      return { value: gw.toString(), label: gw.toString() };
    },
  );
};
