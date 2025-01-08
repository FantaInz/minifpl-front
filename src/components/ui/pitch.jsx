import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, Text } from "@chakra-ui/react";

const Pitch = ({ players, gameweek }) => {
  return (
    <Box borderWidth={1} borderRadius={8} p={4} width="100%" boxShadow="sm">
      <Heading size="md">Pitch</Heading>
      <Text>Gameweek: {gameweek}</Text>
      <Box mt={4}>
        {players && players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                <Text fontWeight="bold">{player.name}</Text>
                <Text>ID: {player.id}</Text>
              </li>
            ))}
          </ul>
        ) : (
          <Text>No players available</Text>
        )}
      </Box>
    </Box>
  );
};

Pitch.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  gameweek: PropTypes.number.isRequired,
};

export default Pitch;
