import React from "react";
import { Box, Flex, Spinner, Text, HStack } from "@chakra-ui/react";
import SearchForm from "@/features/search/search-form";
import { usePlayers } from "@/features/search/api/search-players";
import { useMaxWeek } from "@/features/search/api/get-max-predictions";
import { toaster } from "@/components/ui/toaster";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import ResultTable from "@/features/search/result-table";

const PredictionsPage = () => {
  const { data: maxWeek, isLoading, error: maxWeekError } = useMaxWeek();
  const [filters, setFilters] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [gameweekRange, setGameweekRange] = React.useState({
    startGameweek: null,
    endGameweek: null,
  });

  const {
    data,
    isLoading: isPlayersLoading,
    error: playersError,
  } = usePlayers(filters, { queryConfig: { enabled: !!filters } });

  const handleSearch = (searchData) => {
    const { startGameweek, rangeGameweek, ...rest } = searchData;
    const start = parseInt(startGameweek, 10);
    const range = parseInt(rangeGameweek, 10);
    const endGameweek = Math.min(start + range - 1, maxWeek);

    setPageSize(pageSize);

    const filteredSearchData = {
      ...rest,
      pageNumber: 0,
    };
    setFilters(filteredSearchData);
    setGameweekRange({ startGameweek: start, endGameweek });
    setPageNumber(0);
    console.log("Filtry wyszukiwania:", filteredSearchData);
  };

  const handlePageChange = (page) => {
    const apiPageNumber = page - 1;
    setPageNumber(apiPageNumber);
    setFilters((prevFilters) => ({
      ...prevFilters,
      pageNumber: apiPageNumber,
    }));
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

  const players = data?.players || [];
  const totalPages = data?.totalPages || 0;
  console.log("Players:", players);
  console.log("Total Pages:", totalPages);

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
      alignItems={{ base: "center", md: "flex-start" }}
      p={4}
      gap={6}
    >
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        width={{ base: "100%", md: "50%" }}
      >
        <SearchForm maxWeek={maxWeek} onSubmit={handleSearch} />
      </Box>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        width={{ base: "100%", md: "90%" }}
      >
        {players.length > 0 ? (
          <ResultTable
            startGameweek={gameweekRange.startGameweek}
            endGameweek={gameweekRange.endGameweek}
            players={players}
          />
        ) : (
          <Text size="xl">Brak rezultatów</Text>
        )}
        {totalPages > 1 && (
          <Flex justifyContent="center" mt={4}>
            <PaginationRoot
              count={totalPages * pageSize}
              variant="solid"
              pageSize={pageSize}
              page={pageNumber + 1}
              onPageChange={(e) => handlePageChange(e.page)}
              colorPalette="blue"
            >
              <HStack mt={4}>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default PredictionsPage;
