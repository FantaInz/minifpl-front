import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const getMyPlans = async () => {
  try {
    return await api.get("/api/plan/my_plans");
  } catch (error) {
    console.error("Błąd pobierania planów:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się pobrać planów.",
    );
  }
};

export const getMyPlansQueryOptions = () => {
  return queryOptions({
    queryKey: ["myPlans"],
    queryFn: getMyPlans,
  });
};

export const useMyPlans = ({ queryConfig = {} } = {}) => {
  return useQuery({
    ...getMyPlansQueryOptions(),
    ...queryConfig,
  });
};
