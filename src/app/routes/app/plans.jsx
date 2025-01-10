import React from "react";
import {
  Box,
  Heading,
  Spinner,
  Stack,
  HStack,
  Flex,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useMyPlans } from "@/features/plans/api/get-my-plans";
import { usePlan } from "@/features/plans/api/get-plan";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";
import PlanDetailsAccordion from "@/components/ui/plan-details-accordion";
import Pitch from "@/components/ui/pitch";
import { useNavigation } from "@/hooks/use-navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/auth";

const PlansPage = () => {
  const { goToSolver } = useNavigation();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: plans, isLoading: isLoadingPlans } = useMyPlans();

  const [selectedPlanId, setSelectedPlanId] = React.useState(null);
  const [plansCollection, setPlansCollection] = React.useState(null);

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
          label: plan.name,
          value: plan.id.toString(),
        })),
      });
      setPlansCollection(collection);
    }
  }, [plans]);

  const { data: planDetails, isLoading: isLoadingPlan } = usePlan(
    selectedPlanId,
    {
      enabled: !!selectedPlanId,
    },
  );

  const gameweeks =
    planDetails && planDetails.start_gameweek && planDetails.end_gameweek
      ? Array.from(
          {
            length: planDetails.end_gameweek - planDetails.start_gameweek + 1,
          },
          (_, i) => {
            const gw = planDetails.start_gameweek + i;
            return { value: gw.toString(), label: gw.toString() };
          },
        )
      : [];

  const [selectedGameweek, setSelectedGameweek] = React.useState(null);

  const processedPlayers =
    planDetails && selectedGameweek
      ? (() => {
          const currentSquad =
            planDetails.squads[selectedGameweek - planDetails.start_gameweek];
          const reversedSubs = [...currentSquad.subs].reverse();
          const sortedSubs =
            reversedSubs.length > 0
              ? [
                  reversedSubs[0],
                  ...reversedSubs
                    .slice(1)
                    .sort(
                      (a, b) =>
                        b.expectedPoints[selectedGameweek - 1] -
                        a.expectedPoints[selectedGameweek - 1],
                    ),
                ]
              : [];

          const players = [...currentSquad.team, ...sortedSubs];
          return players.map((player) => ({
            ...player,
            expectedPoints: player.expectedPoints.map((point) =>
              Number(parseFloat(point).toFixed(2)),
            ),
          }));
        })()
      : [];

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
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Nie znaleziono planów
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Wygląda na to, że nie masz żadnych zapisanych planów.
        </Text>
        <Button
          mt={6}
          colorPalette="blue"
          size="xl"
          onClick={() => goToSolver()}
        >
          Przejdź do solvera
        </Button>
      </Flex>
    );
  }

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
          <Stack gap="4">
            <Heading size="2xl" mx="auto">
              Wybierz kolejkę
            </Heading>
            <RadioCardRoot
              align="center"
              margin="auto"
              defaultValue={selectedGameweek?.toString()}
              onValueChange={(e) => setSelectedGameweek(e.value)}
            >
              <HStack align="stretch">
                {gameweeks.map((gw) => (
                  <RadioCardItem
                    key={gw.value}
                    value={gw.value}
                    label={gw.label}
                    maxW="50px"
                    maxH="50px"
                    bg="white"
                    indicator={false}
                    borderRadius="md"
                    shadow="lg"
                    cursor="pointer"
                  />
                ))}
              </HStack>
            </RadioCardRoot>
          </Stack>
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
          <SelectRoot
            collection={plansCollection}
            size="lg"
            bg="white"
            width={{ base: "80%", md: "40%" }}
            borderRadius="md"
            shadow="lg"
            margin="auto"
            value={[selectedPlanId]}
            onValueChange={(e) => {
              setSelectedPlanId(e.value[0]);
            }}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Wybierz plan" />
            </SelectTrigger>
            <SelectContent>
              {plansCollection.items.map((plan) => (
                <SelectItem item={plan} key={plan.value}>
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        ) : (
          <Text mt={4}>Ładowanie listy planów...</Text>
        )}

        {planDetails && <PlanDetailsAccordion planDetails={planDetails} />}
      </Box>
    </Flex>
  );
};

export default PlansPage;
