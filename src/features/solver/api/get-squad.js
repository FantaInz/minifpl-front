import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const getSquad = (squadId) => {
  try {
    return api.get(`/api/squad/update/${squadId}`);
  } catch (error) {
    console.error("Błąd pobierania składu:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się pobrać składu.",
    );
  }
};

export const getSquadQueryOptions = (squadId) => {
  return queryOptions({
    queryKey: ["squad", squadId],
    queryFn: () => getSquad(squadId),
  });
};

export const useSquad = (squadId, { queryConfig = {} } = {}) => {
  return useQuery({
    ...getSquadQueryOptions(squadId),
    ...queryConfig,
  });
};
