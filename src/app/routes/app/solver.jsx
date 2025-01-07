import React, { useState, useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

import TeamModal from "@/features/solver/team-modal";
import { useUser } from "@/lib/auth";

const SolverPage = () => {
  const { data: user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.squad_id) {
      setIsModalOpen(true);
    }
  }, [user]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box className="flex h-screen w-screen items-center justify-center flex-col">
      <Heading>Solver</Heading>
      <Text>Tu będzie solver</Text>

      <TeamModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default SolverPage;
