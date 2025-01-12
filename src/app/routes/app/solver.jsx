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
import { useTranslateError } from "@/utils/translate-error";
import { toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";

const SolverPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translateErrorSolver } = useTranslateError();
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myPlans"] });
      setIsLoadingModalOpen(false);
      toaster.create({
        title: t("toaster.planSaved.title"),
        description: t("toaster.planSaved.description"),
        type: "success",
      });
      setErrorMessage("");
      setSavedPlanName("");
      goToPlans();
    },
    onError: (error) => {
      const message = t("errors.planSave", { detail: error.message });
      setErrorMessage(message);
      setIsLoadingModalOpen(true);
    },
  });

  const { mutate: optimizeSquad } = useOptimizeSquad({
    onSuccess: (optimizedData) => {
      setErrorMessage("");
      savePlan({
        ...optimizedData,
        name: savedPlanName,
      });
    },
    onError: (error) => {
      const message = error.response?.data?.detail || error.message;
      setErrorMessage(translateErrorSolver(message));
      setIsLoadingModalOpen(true);
    },
  });

  const handleSolverFormSubmit = (data) => {
    setSavedPlanName(data.planName);
    setErrorMessage("");
    setIsLoadingModalOpen(true);
    optimizeSquad(data);
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
      toaster.create({
        title: t("toaster.teamIdUpdated.title"),
        description: t("toaster.teamIdUpdated.description"),
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: t("toaster.teamIdUpdateFailed.title"),
        description: t("toaster.teamIdUpdateFailed.description"),
        type: "error",
      });
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
        <Text mt={4}>{t("solverPage.loadingSquad")}</Text>
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
              {t("solverPage.yourSquad", { gameweek: squadData?.lastUpdate })}
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
          {t("solverPage.noSquadData")}
        </Text>
      )}

      <TeamModal isOpen={isModalOpen} onSubmit={handleSubmitTeamId} />
      <LoadingModal
        isOpen={isLoadingModalOpen}
        text={t("solverPage.optimizationInProgress")}
        error={errorMessage}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default SolverPage;
