import React from "react";
import PropTypes from "prop-types";
import { Box, Image, Text, Flex } from "@chakra-ui/react";
import mapTeamIdToCode from "@/utils/team-mapper";
import { getLastName } from "@/utils/get-last-name";

const Player = ({ name, club_id, points }) => {
  const clubCode = mapTeamIdToCode(club_id);
  const shirtSrc = new URL(
    `/src/assets/koszulki/${clubCode}.svg`,
    import.meta.url,
  ).href;
  const lastName = getLastName(name);

  return (
    <Flex direction="column" align="center" width={["60px", "80px", "100px"]}>
      <Image
        src={shirtSrc}
        alt={`${clubCode} shirt`}
        boxSize={["30px", "40px", "50px"]}
      />

      <Box
        py={[0, 1]}
        bg="white"
        borderRadius="md"
        textAlign="center"
        width={["60px", "80px", "100px"]}
      >
        <Text
          fontWeight="bold"
          fontSize={["xs", "sm", "md"]}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          title={lastName}
        >
          {lastName}
        </Text>

        <Box my={[0, 1]} borderBottom="1px solid black" width="100%" />

        <Text fontSize={["xs", "sm"]} fontWeight="bold">
          {points}
        </Text>
      </Box>
    </Flex>
  );
};

Player.propTypes = {
  name: PropTypes.string.isRequired,
  club_id: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
};

export default Player;
