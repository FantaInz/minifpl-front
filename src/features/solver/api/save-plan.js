import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const savePlan = async (data) => {
  try {
    return await api.post("/api/plan/save", data);
  } catch (error) {
    console.error("Błąd zapisywania planu:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się zapisać planu.",
    );
  }
};

export const useSavePlan = (options = {}) => {
  return useMutation({
    mutationKey: ["savePlan"],
    mutationFn: savePlan,
    ...options,
  });
};
