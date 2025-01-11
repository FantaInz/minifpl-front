import React from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

const NoPlansMessage = ({ onNavigateToSolver }) => {
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
      <Text fontSize="lg" color="gray.500" mb={6}>
        Wygląda na to, że nie masz żadnych zapisanych planów.
      </Text>
      <Button colorPalette="blue" size="xl" onClick={onNavigateToSolver}>
        Przejdź do solvera
      </Button>
    </Flex>
  );
};

export default NoPlansMessage;
