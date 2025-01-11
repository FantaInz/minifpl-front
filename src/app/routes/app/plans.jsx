import React from "react";
import {
  Box,
  Spinner,
  Flex,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import { useMyPlans } from "@/features/plans/api/get-my-plans";
import { usePlan } from "@/features/plans/api/get-plan";
import { useDeletePlan } from "@/features/plans/api/delete-plan";
import PlanDetailsAccordion from "@/components/ui/plan-details-accordion";
import PlanSelector from "@/components/ui/plan-selector";
import NoPlansMessage from "@/components/ui/no-plans-message";
import Pitch from "@/components/ui/pitch";
import ConfirmDeletionModal from "@/components/ui/confirm-deletion-modal";
import { useNavigation } from "@/hooks/use-navigation";
import { useUser } from "@/lib/auth";
import { toaster } from "@/components/ui/toaster";
import GameweekSelector from "@/components/ui/gameweek-selector";
import useProcessedPlayers from "@/hooks/use-processed-players";
import { useGameweeks } from "@/hooks/plan-hooks";

const PlansPage = () => {
  const { goToSolver } = useNavigation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: plans, isLoading: isLoadingPlans } = useMyPlans();

  const deletePlanMutation = useDeletePlan();
  const queryClient = useQueryClient();

  const [selectedPlanId, setSelectedPlanId] = React.useState(null);
  const [plansCollection, setPlansCollection] = React.useState(null);
  const [selectedGameweek, setSelectedGameweek] = React.useState(null);
  const [pendingDeleteTitle, setPendingDeleteTitle] = React.useState(null);

  React.useEffect(() => {
    if (!isUserLoading && !user?.squad_id) {
      goToSolver();
    }
  }, [isUserLoading, user, goToSolver]);

  React.useEffect(() => {
    if (plans && plans.length > 0) {
      const highestId = Math.max(...plans.map((plan) => plan.id));
      setSelectedPlanId(highestId.toString());

      const collection = createListCollection({
        items: plans.map((plan) => ({
          label: `${plan.name} ${
            plan.start_gameweek === plan.end_gameweek
              ? `(${plan.start_gameweek})`
              : `(${plan.start_gameweek}-${plan.end_gameweek})`
          }`,
          value: plan.id.toString(),
        })),
      });

      setPlansCollection(collection);
    }
  }, [plans]);

  const handleDeletePlan = async () => {
    if (selectedPlanId) {
      try {
        const oldId = selectedPlanId;

        const titleToDelete = plansCollection?.items.find(
          (item) => item.value === oldId,
        )?.label;

        setPendingDeleteTitle(titleToDelete);

        const remainingPlans = plans.filter(
          (plan) => plan.id.toString() !== oldId,
        );
        const updatedCollection = createListCollection({
          items: remainingPlans.map((plan) => ({
            label: `${plan.name} ${
              plan.start_gameweek === plan.end_gameweek
                ? `(${plan.start_gameweek})`
                : `(${plan.start_gameweek}-${plan.end_gameweek})`
            }`,
            value: plan.id.toString(),
          })),
        });
        setPlansCollection(updatedCollection);

        setSelectedPlanId(
          remainingPlans.length > 0 ? remainingPlans[0].id.toString() : null,
        );

        await deletePlanMutation.mutateAsync(oldId);

        await Promise.all([
          queryClient.removeQueries({
            queryKey: ["plan", oldId],
          }),
          queryClient.invalidateQueries({ queryKey: ["myPlans"] }),
        ]);

        console.log(`Plan o ID ${oldId} został usunięty!`);

        toaster.create({
          title: "Plan usunięty.",
          type: "success",
        });
      } catch {
        toaster.create({
          title: "Błąd podczas usuwania planu.",
          type: "error",
        });
      } finally {
        setPendingDeleteTitle(null);
      }
    }
  };

  const { data: planDetails, isLoading: isLoadingPlan } = usePlan(
    selectedPlanId,
    {
      enabled:
        !!selectedPlanId &&
        plans.some((plan) => plan.id.toString() === selectedPlanId),
    },
  );

  const gameweeks = useGameweeks(planDetails);

  React.useEffect(() => {
    if (gameweeks.length > 0 && selectedGameweek === null) {
      setSelectedGameweek(gameweeks[0].value);
    }
  }, [gameweeks, selectedGameweek]);

  if (isLoadingPlans || isLoadingPlan) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" role="status" />
        <Text mt={4}>Ładowanie danych...</Text>
      </Flex>
    );
  }

  if (!plans || plans.length === 0) {
    return <NoPlansMessage onNavigateToSolver={goToSolver} />;
  }

  const processedPlayers = useProcessedPlayers(planDetails, selectedGameweek);

  return (
    <Flex
      height="100vh"
      flexDirection={{
        base: "column",
        md: "row",
      }}
    >
      <Box flex="1" p={4}>
        {gameweeks.length > 0 && selectedGameweek !== null && (
          <GameweekSelector
            gameweeks={gameweeks}
            selectedGameweek={selectedGameweek}
            onChange={setSelectedGameweek}
          />
        )}
        {processedPlayers.length > 0 && (
          <Box mt={6}>
            <Pitch
              players={processedPlayers}
              gameweek={parseInt(selectedGameweek, 10)}
              displayMode="both"
            />
          </Box>
        )}
      </Box>

      <Box flex="1" p={4}>
        {plansCollection ? (
          <Flex justifyContent="center" alignItems="center" gap={4} mb={6}>
            <PlanSelector
              plansCollection={plansCollection}
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
            />
            <ConfirmDeletionModal
              onConfirm={handleDeletePlan}
              title={
                pendingDeleteTitle ||
                plansCollection?.items.find(
                  (item) => item.value === selectedPlanId,
                )?.label ||
                "Plan"
              }
            />
          </Flex>
        ) : (
          <Text mt={4}>Ładowanie listy planów...</Text>
        )}

        {planDetails && <PlanDetailsAccordion planDetails={planDetails} />}
      </Box>
    </Flex>
  );
};

export default PlansPage;
