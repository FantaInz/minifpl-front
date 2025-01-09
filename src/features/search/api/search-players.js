import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const searchPlayers = async (filters) => {
  try {
    return api.post("/api/player/search", filters);
  } catch (error) {
    console.error("Błąd wyszukiwania graczy:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się pobrać listy graczy.",
    );
  }
};

export const getSearchPlayersQueryOptions = (filters) => {
  return queryOptions({
    queryKey: ["players", filters],
    queryFn: () => searchPlayers(filters),
  });
};

export const usePlayers = (filters, { queryConfig = {} } = {}) => {
  return useQuery({
    ...getSearchPlayersQueryOptions(filters),
    ...queryConfig,
  });
};
