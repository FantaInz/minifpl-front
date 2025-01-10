import React, { useState, useEffect } from "react";
import { Box, Spinner, Flex, Heading, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import TeamModal from "@/features/solver/team-modal";
import Pitch from "@/components/ui/pitch";
import SolverForm from "@/features/solver/solver-form";
import LoadingModal from "@/components/ui/loading-modal";
import { useUser } from "@/lib/auth";
import { useSquad } from "@/features/solver/api/get-squad";
import { useOptimizeSquad } from "@/features/solver/api/optimize-squad";
import { useSavePlan } from "@/features/solver/api/save-plan";
import { useNavigation } from "@/hooks/use-navigation";
import { translateErrorSolver } from "@/utils/translate-error";

const SolverPage = () => {
  const queryClient = useQueryClient();
  const { goToSolver, goToPlans } = useNavigation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamId, setTeamId] = useState(user?.squad_id || null);
  const [hasSquadId, setHasSquadId] = useState(!!user?.squad_id);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedPlanName, setSavedPlanName] = useState("");

  const { data: squadData, isLoading: isSquadLoading } = useSquad(
    teamId || undefined,
    {
      queryConfig: { enabled: !!teamId },
      onSuccess: () => {
        setIsModalOpen(false);
      },
    },
  );

  const { mutate: savePlan } = useSavePlan({
    onSuccess: (data) => {
      console.log("Plan zapisany:", data);
      queryClient.invalidateQueries({ queryKey: ["myPlans"] });
      setIsLoadingModalOpen(false);
      setErrorMessage("");
      setSavedPlanName("");
      goToPlans();
    },
    onError: (error) => {
      console.error("Błąd zapisywania planu:", error.message);
      setErrorMessage("Nie udało się zapisać planu. Spróbuj ponownie.");
      setIsLoadingModalOpen(true);
    },
  });

  const optimizeSquadMutation = useOptimizeSquad({
    onSuccess: (optimizedData) => {
      console.log("Optimized Squad:", optimizedData);
      setErrorMessage("");
      savePlan({
        ...optimizedData,
        name: savedPlanName,
      });
    },
    onError: (error) => {
      console.error("Optimization Error:", error.message);
      const message = error.response?.data?.detail || error.message;
      setErrorMessage(translateErrorSolver(message));
      setIsLoadingModalOpen(true);
    },
  });

  const handleSolverFormSubmit = (data) => {
    setSavedPlanName(data.planName);
    setIsLoadingModalOpen(true);
    optimizeSquadMutation.mutate(data);
  };

  const handleCloseModal = () => {
    setIsLoadingModalOpen(false);
    setErrorMessage("");
    goToSolver();
  };

  useEffect(() => {
    if (!isUserLoading && !hasSquadId) {
      setIsModalOpen(true);
    }
  }, [isUserLoading, hasSquadId]);

  const handleSubmitTeamId = async (teamId) => {
    try {
      setTeamId(teamId);

      queryClient.setQueryData(["authenticated-user"], (oldData) => ({
        ...oldData,
        squad_id: teamId,
      }));
      setHasSquadId(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Błąd przy aktualizacji składu:", error.message);
      throw error;
    }
  };

  if (isUserLoading || isSquadLoading) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" role="status" />
        <Text mt={4}>Pobieranie danych o składzie...</Text>
      </Flex>
    );
  }

  const processedPlayers =
    squadData?.players.map((player) => ({
      ...player,
      expectedPoints: player.expectedPoints.map((point) =>
        Number(parseFloat(point).toFixed(2)),
      ),
    })) || [];

  return (
    <Box>
      {user?.squad_id ? (
        <Flex
          height="100%"
          flexDirection={{
            base: "column",
            xl: "row",
          }}
        >
          <Box flex="1" p={4} order={[2, 1]}>
            <Heading size="4xl" mb={4} textAlign="center">
              Twój Skład w GW{squadData?.lastUpdate}
            </Heading>

            <Pitch
              players={processedPlayers}
              gameweek={squadData?.lastUpdate}
              displayMode="actual"
            />
          </Box>
          <Box flex="1" p={4} order={[1, 2]} mt={[0, 14]}>
            <SolverForm
              freeTransfers={squadData?.freeTransfers}
              budget={Number(
                parseFloat(squadData?.transferBudget / 10).toFixed(1),
              )}
              teamId={teamId}
              teamName={squadData?.name}
              onSubmit={handleSolverFormSubmit}
            />
          </Box>
        </Flex>
      ) : (
        <Text textAlign="center" fontSize="2xl" mt={6}>
          Brak danych o składzie.
        </Text>
      )}

      <TeamModal isOpen={isModalOpen} onSubmit={handleSubmitTeamId} />
      <LoadingModal
        isOpen={isLoadingModalOpen}
        text="Trwa optymalizacja składu..."
        error={errorMessage}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default SolverPage;
