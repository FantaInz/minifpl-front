import React from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Stack,
  HStack,
  Flex,
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

const PlansPage = () => {
  const { data: plans, isLoading: isLoadingPlans } = useMyPlans();

  const [selectedPlanId, setSelectedPlanId] = React.useState(null);
  const [plansCollection, setPlansCollection] = React.useState(null);

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
      console.log(plansCollection);
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

  React.useEffect(() => {
    if (gameweeks.length > 0 && selectedGameweek === null) {
      setSelectedGameweek(gameweeks[0].value);
    }
  }, [gameweeks, selectedGameweek]);

  if (isLoadingPlans) {
    return (
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" role="status" />
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
      <Box flex="1" p={4} bg="gray.50">
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

        {isLoadingPlan ? (
          <Flex
            height="100vh"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Spinner size="xl" role="status" />
            <Text mt={4}>Ładowanie szczegółów planu...</Text>
          </Flex>
        ) : (
          planDetails && <PlanDetailsAccordion planDetails={planDetails} />
        )}
      </Box>
    </Flex>
  );
};

export default PlansPage;
