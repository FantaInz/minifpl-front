import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const deletePlan = async (planId) => {
  try {
    return await api.delete(`/api/plan/delete/${planId}`);
  } catch (error) {
    console.error("Błąd usuwania planu:", error.response || error.message);
    throw new Error(
      error.response?.data?.message || "Nie udało się usunąć planu.",
    );
  }
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      console.log("Plan został usunięty.");
      queryClient.invalidateQueries({ queryKey: ["myPlans"] });
    },
    onError: (error) => {
      console.error("Błąd podczas usuwania planu:", error.message);
    },
  });
};
