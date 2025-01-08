import React, { useState, useEffect } from "react";
import { Box, Spinner, Flex } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import TeamModal from "@/features/solver/team-modal";
import Pitch from "@/components/ui/pitch";
import SolverForm from "@/features/solver/solver-form";
import { useUser } from "@/lib/auth";
import { useSquad } from "@/features/solver/api/get-squad";

const SolverPage = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamId, setTeamId] = useState(user?.squad_id || null);
  const [hasSquadId, setHasSquadId] = useState(!!user?.squad_id);

  const { data: squadData, isLoading: isSquadLoading } = useSquad(
    teamId || undefined,
    {
      queryConfig: { enabled: !!teamId },
      onSuccess: () => {
        setIsModalOpen(false);
      },
    },
  );

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
      points: Number(parseFloat(player.points).toFixed(2)),
      expectedPoints: player.expectedPoints.map((point) =>
        Number(parseFloat(point).toFixed(2)),
      ),
    })) || [];

  return (
    <Box height="100vh">
      <Flex height="100%" flexDirection={["column", "row"]}>
        <Box flex="1" p={4} order={[2, 1]}>
          <Pitch
            players={processedPlayers}
            gameweek={squadData?.lastUpdate}
            future={false}
          />
        </Box>
        <Box flex="1" p={4} order={[1, 2]}>
          <SolverForm
            freeTransfers={squadData?.freeTransfers}
            budget={Number(
              parseFloat(squadData?.transferBudget / 10).toFixed(1),
            )}
            teamId={teamId}
            onSubmit={(data) => console.log("Form Submitted:", data)}
          />
        </Box>
      </Flex>

      <TeamModal isOpen={isModalOpen} onSubmit={handleSubmitTeamId} />
    </Box>
  );
};

export default SolverPage;
