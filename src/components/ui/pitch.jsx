import React from "react";
import PropTypes from "prop-types";
import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import Player from "@/components/ui/player";

function groupPlayersByPosition(players) {
  const gk = players.filter((p) => p.position === "Goalkeeper");
  const def = players.filter((p) => p.position === "Defender");
  const mid = players.filter((p) => p.position === "Midfielder");
  const fwd = players.filter((p) => p.position === "Forward");

  return { gk, def, mid, fwd };
}

const Pitch = ({ players, gameweek, future }) => {
  const benchPlayers = players.slice(-4);
  const mainPlayers = players.slice(0, players.length - 4);

  const { gk, def, mid, fwd } = groupPlayersByPosition(mainPlayers);

  const getDisplayPoints = (player) => {
    const { points, expectedPoints } = player;
    return future ? expectedPoints[gameweek - 1] : points[points.length - 1];
  };

  const renderRow = (playersRow) => (
    <Flex justify="center" wrap="wrap" gap={2} mb={3}>
      {playersRow.map((player) => {
        const displayPoints = getDisplayPoints(player);

        return (
          <Player
            key={player.id}
            name={player.name}
            club_id={player.team.id}
            points={displayPoints}
          />
        );
      })}
    </Flex>
  );

  return (
    <Box
      position="relative"
      mx="auto"
      p={4}
      maxW="500px"
      aspectRatio="2 / 3"
      bgImage="url(/src/assets/Football_field.svg)"
      bgSize="contain"
      bgPosition="center top"
      bgRepeat="no-repeat"
    >
      <Box mt={[4, 9]} />
      {gk.length > 0 && <>{renderRow(gk)}</>}
      {def.length > 0 && <>{renderRow(def)}</>}
      {mid.length > 0 && <>{renderRow(mid)}</>}
      {fwd.length > 0 && <>{renderRow(fwd)}</>}
      <Box bg="blue.200" mt={[12, 14]} borderRadius="md" p={[0, 5]}>
        <Flex justify="center" wrap="wrap" gap={2}>
          {benchPlayers.map((player) => {
            const displayPoints = getDisplayPoints(player);

            return (
              <Player
                key={player.id}
                name={player.name}
                club_id={player.team.id}
                points={displayPoints}
              />
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

Pitch.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      points: PropTypes.arrayOf(PropTypes.number).isRequired,
      expectedPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  ).isRequired,
  gameweek: PropTypes.number.isRequired,
  future: PropTypes.bool.isRequired,
};

export default Pitch;
