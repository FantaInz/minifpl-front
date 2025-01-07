import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import NavBar from "@/features/navbar/navbar";

const AppLayout = () => {
  return (
    <Box>
      <NavBar />
      <Box p={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
