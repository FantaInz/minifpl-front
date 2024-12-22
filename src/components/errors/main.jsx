import React from "react";
import { Button, Box, Text } from "@chakra-ui/react";

export const MainErrorFallback = () => {
  return (
    <Box
      role="alert"
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
    >
      <Text fontSize="lg" fontWeight="semibold" color="red.500" mb={4}>
        Coś poszło nie tak :(
      </Text>
      <Button
        colorScheme="red"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </Box>
  );
};
