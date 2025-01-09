import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const getPlan = async (planId) => {
  try {
    return await api.get(`/api/plan/get/${planId}`);
  } catch (error) {
    console.error("Błąd pobierania planu:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się pobrać planu.",
    );
  }
};

export const getPlanQueryOptions = (planId) => {
  return queryOptions({
    queryKey: ["plan", planId],
    queryFn: () => getPlan(planId),
  });
};

export const usePlan = (planId, { queryConfig = {} } = {}) => {
  return useQuery({
    ...getPlanQueryOptions(planId),
    ...queryConfig,
  });
};
