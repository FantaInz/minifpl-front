import React from "react";
import { Button, Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export const MainErrorFallback = () => {
  return (
    <Box
      role="alert"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={8}
    >
      <Text fontSize="2xl" fontWeight="bold" color="red.500" mb={4}>
        Coś poszło nie tak 😢
      </Text>
      <Button colorScheme="red" onClick={() => window.location.reload()}>
        Odśwież aplikację
      </Button>
    </Box>
  );
};

MainErrorFallback.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};
