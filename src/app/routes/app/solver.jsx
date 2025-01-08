import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";

import TeamModal from "@/features/solver/team-modal";
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

  return (
    <Box className="flex h-screen w-screen items-center justify-center flex-col">
      <Heading>Solver</Heading>
      <Text>Tu będzie solver</Text>
      {squadData && (
        <Box mt={4} p={4} borderWidth={1} borderRadius={8}>
          <Text>Skład:</Text>
          <pre>{JSON.stringify(squadData, null, 2)}</pre>
        </Box>
      )}
      <TeamModal isOpen={isModalOpen} onSubmit={handleSubmitTeamId} />
    </Box>
  );
};

export default SolverPage;
