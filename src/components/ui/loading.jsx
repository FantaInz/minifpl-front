import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

export const Loading = () => (
  <Box
    className="flex h-screen w-screen items-center justify-center"
    role="status"
  >
    <Spinner size="xl" />
  </Box>
);
