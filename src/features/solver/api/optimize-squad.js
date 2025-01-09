import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const optimizeSquad = async (data) => {
  try {
    const response = await api.post("/api/squad/optimize", data);
    return response;
  } catch (error) {
    console.error(
      "Błąd optymalizacji składu:",
      error.response || error.message,
    );
    throw new Error(
      error.response?.data?.detail || "Nie udało się zoptymalizować składu.",
    );
  }
};

export const useOptimizeSquad = (options = {}) => {
  return useMutation({
    mutationKey: ["optimizeSquad"],
    mutationFn: optimizeSquad,
    ...options,
  });
};
