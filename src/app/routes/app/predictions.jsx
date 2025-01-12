import React from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import SearchForm from "@/features/search/search-form";
import { usePlayers } from "@/features/search/api/search-players";
import { useMaxWeek } from "@/features/search/api/get-max-predictions";
import { toaster } from "@/components/ui/toaster";

const PredictionsPage = () => {
  const { data: maxWeek, isLoading, error: maxWeekError } = useMaxWeek();
  const [filters, setFilters] = React.useState(null);
  const [players, setPlayers] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [gameweekRange, setGameweekRange] = React.useState({
    startGameweek: null,
    endGameweek: null,
  });

  const {
    data,
    isLoading: isPlayersLoading,
    error: playersError,
  } = usePlayers(filters, { queryConfig: { enabled: !!filters } });

  React.useEffect(() => {
    if (data) {
      setPlayers(data.players || []);
      setTotalPages(data.totalPages || 0);
    }
  }, [data]);

  const handleSearch = (searchData) => {
    const { startGameweek, rangeGameweek, ...rest } = searchData;
    const start = parseInt(startGameweek.value, 10);
    const range = parseInt(rangeGameweek.value, 10);
    const endGameweek = Math.min(start + range - 1, maxWeek);

    const filteredSearchData = {
      ...rest,
      pageNumber: 0,
    };
    setFilters(filteredSearchData);
    setGameweekRange({ startGameweek: start, endGameweek });
    setPageNumber(0);
    console.log("Filtry wyszukiwania:", filteredSearchData);
  };

  React.useEffect(() => {
    if (maxWeekError) {
      toaster.create({
        title: "Błąd",
        description: "Nie udało się pobrać danych o maksymalnej kolejce.",
        type: "error",
      });
    }

    if (playersError) {
      toaster.create({
        title: "Błąd",
        description: "Nie udało się pobrać wyników wyszukiwania graczy.",
        type: "error",
      });
    }
  }, [maxWeekError, playersError]);

  if (isLoading || isPlayersLoading) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" role="status" />
        <Text mt={4}>Ładowanie danych...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
      alignItems={{ base: "center", md: "flex-start" }}
      height="100vh"
      p={4}
      gap={6}
    >
      <Box
        flex={{ base: "0 0 auto", md: "1" }}
        width={{ base: "100%", md: "50%" }}
        maxWidth="600px"
      >
        <SearchForm maxWeek={maxWeek} onSubmit={handleSearch} />
      </Box>
      <Box
        flex={{ base: "0 0 auto", md: "1" }}
        width={{ base: "100%", md: "50%" }}
        maxWidth="600px"
      >
        <Text fontSize="xl" mb={4}>
          Wyniki wyszukiwania: {totalPages} {gameweekRange.startGameweek} -{" "}
          {gameweekRange.endGameweek} {pageNumber}
        </Text>
        {players.length > 0 ? (
          <Box as="ul">
            {players.map((player) => (
              <Box as="li" key={player.id} mb={2}>
                {player.name} - {player.team.name} ({player.position})
              </Box>
            ))}
          </Box>
        ) : (
          <Text>Brak wyników wyszukiwania</Text>
        )}
      </Box>
    </Flex>
  );
};

export default PredictionsPage;
