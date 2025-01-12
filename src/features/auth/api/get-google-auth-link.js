import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const getGoogleAuthLink = async () => {
  try {
    return await api.get("/api/google/login");
  } catch (error) {
    console.error(
      "Błąd pobierania linku Google Auth:",
      error.response || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        "Nie udało się pobrać linku autoryzacji.",
    );
  }
};

export const getGoogleAuthLinkQueryOptions = () => {
  return queryOptions({
    queryKey: ["googleAuthLink"],
    queryFn: getGoogleAuthLink,
  });
};

export const useGoogleAuthLink = ({ queryConfig = {} } = {}) => {
  return useQuery({
    ...getGoogleAuthLinkQueryOptions(),
    ...queryConfig,
  });
};
