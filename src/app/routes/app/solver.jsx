import React, { useState, useEffect } from "react";
import { Box, Spinner, Flex, Heading } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import TeamModal from "@/features/solver/team-modal";
import Pitch from "@/components/ui/pitch";
import SolverForm from "@/features/solver/solver-form";
import LoadingModal from "@/components/ui/loading-modal";
import { useUser } from "@/lib/auth";
import { useSquad } from "@/features/solver/api/get-squad";
import { useOptimizeSquad } from "@/features/solver/api/optimize-squad";
import { useNavigation } from "@/hooks/use-navigation";

const SolverPage = () => {
  const queryClient = useQueryClient();
  const { goToSolver } = useNavigation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamId, setTeamId] = useState(user?.squad_id || null);
  const [hasSquadId, setHasSquadId] = useState(!!user?.squad_id);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: squadData, isLoading: isSquadLoading } = useSquad(
    teamId || undefined,
    {
      queryConfig: { enabled: !!teamId },
      onSuccess: () => {
        setIsModalOpen(false);
      },
    },
  );

  const optimizeSquadMutation = useOptimizeSquad({
    onSuccess: (data) => {
      console.log("Optimized Squad:", data);
      setIsLoadingModalOpen(false);
      setErrorMessage("");
    },
    onError: (error) => {
      console.error("Optimization Error:", error.message);
      const message =
        error.message ===
        "Optimization failed, probably due to unfeasible constraints"
          ? "Nie można spełnić wymagań."
          : "Wystąpił błąd podczas optymalizacji. Sprawdź czy podałeś spełnialne ograniczenia i spróbuj ponownie.";
      setErrorMessage(message);
      setIsLoadingModalOpen(true);
    },
  });

  const handleSolverFormSubmit = (data) => {
    console.log("Form Data Submitted:", data);
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
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" role="status" />
      </Box>
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
            future={false}
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
