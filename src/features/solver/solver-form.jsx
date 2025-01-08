import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

const SolverForm = ({ freeTransfers, budget, teamId }) => {
  return (
    <Box border="1px solid" borderColor="gray.300" borderRadius="md" p={4}>
      <Text>{freeTransfers}</Text>
      <Text>{budget}</Text>
      <Text>{teamId}</Text>
    </Box>
  );
};

SolverForm.propTypes = {
  freeTransfers: PropTypes.number.isRequired,
  budget: PropTypes.number.isRequired,
  teamId: PropTypes.number.isRequired,
  onSubmit: PropTypes.func,
};

export default SolverForm;
