import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

export const Loading = () => (
  <Box
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Spinner size="xl" role="status" />
  </Box>
);
