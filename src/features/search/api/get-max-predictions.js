import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const getMaxWeek = async () => {
  try {
    return await api.get("/api/player/maxWeek");
  } catch (error) {
    console.error("Błąd pobierania maxWeek:", error.response || error.message);
    throw new Error(
      error.response?.data?.message ||
        "Nie udało się pobrać maksymalnego tygodnia.",
    );
  }
};

export const getMaxWeekQueryOptions = () => {
  return queryOptions({
    queryKey: ["maxWeek"],
    queryFn: getMaxWeek,
  });
};

export const useMaxWeek = ({ queryConfig = {} } = {}) => {
  return useQuery({
    ...getMaxWeekQueryOptions(),
    ...queryConfig,
  });
};
