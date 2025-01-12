import React from "react";
import PropTypes from "prop-types";
import { Box, Image, Text, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import mapTeamIdToCode from "@/utils/team-mapper";
import { getLastName } from "@/utils/get-last-name";
import { Tooltip } from "./tooltip";

const Player = ({ name, club_id, points }) => {
  const { t } = useTranslation();

  const clubCode = mapTeamIdToCode(club_id);
  const shirtSrc = new URL(
    `/src/assets/koszulki/${clubCode}.svg`,
    import.meta.url,
  ).href;
  const lastName = getLastName(name);

  const renderPoints = () => {
    const { actual, expected, mode } = points;

    if (mode === "both") {
      if (
        actual !== undefined &&
        actual !== null &&
        expected !== undefined &&
        expected !== null
      ) {
        return (
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            width="100%"
            gap={{ base: 0.5, sm: 1 }}
          >
            <Tooltip showArrow content={t("player.receivedPoints", { actual })}>
              <Box
                bg="green.100"
                color="green.800"
                px={2}
                borderRadius="md"
                flex="1"
                textAlign="center"
              >
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  fontWeight="bold"
                >
                  {actual}
                </Text>
              </Box>
            </Tooltip>
            <Tooltip
              showArrow
              content={t("player.expectedPoints", { expected })}
            >
              <Box
                bg="blue.100"
                color="blue.800"
                px={2}
                borderRadius="md"
                flex="1"
                textAlign="center"
              >
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  fontWeight="bold"
                >
                  {expected}
                </Text>
              </Box>
            </Tooltip>
          </Flex>
        );
      } else if (actual !== undefined && actual !== null) {
        return (
          <Tooltip showArrow content={t("player.receivedPoints", { actual })}>
            <Box
              bg="green.100"
              color="green.800"
              px={2}
              borderRadius="md"
              textAlign="center"
            >
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
              >
                {actual}
              </Text>
            </Box>
          </Tooltip>
        );
      } else if (expected !== undefined && expected !== null) {
        return (
          <Tooltip showArrow content={t("player.expectedPoints", { expected })}>
            <Box
              bg="blue.100"
              color="blue.800"
              px={2}
              borderRadius="md"
              textAlign="center"
            >
              <Text
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
              >
                {expected}
              </Text>
            </Box>
          </Tooltip>
        );
      }
    }

    const tooltipText =
      mode === "actual"
        ? t("player.receivedPoints", { actual })
        : t("player.expectedPoints", { expected });

    const boxColor = mode === "actual" ? "green.100" : "blue.100";
    const textColor = mode === "actual" ? "green.800" : "blue.800";

    const value = mode === "actual" ? actual : expected;

    return (
      <Tooltip showArrow content={tooltipText}>
        <Box bg={boxColor} color={textColor} px={2} borderRadius="md">
          <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} fontWeight="bold">
            {value}
          </Text>
        </Box>
      </Tooltip>
    );
  };

  return (
    <Flex
      direction="column"
      align="center"
      width={{ base: "50px", sm: "70px", md: "80px", lg: "100px" }}
      maxW="100px"
    >
      <Image
        src={shirtSrc}
        alt={`${clubCode} shirt`}
        boxSize={{ base: "30px", sm: "40px", md: "50px" }}
      />
      <Box
        py={[0, 1]}
        bg="white"
        borderRadius="md"
        textAlign="center"
        width="100%"
      >
        <Text
          fontWeight="bold"
          fontSize={{ base: "xs", sm: "sm", md: "md" }}
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          title={lastName}
        >
          {lastName}
        </Text>

        <Box my={[0, 1]} borderBottom="1px solid black" width="100%" />

        <Flex justify="center">{renderPoints()}</Flex>
      </Box>
    </Flex>
  );
};

Player.propTypes = {
  name: PropTypes.string.isRequired,
  club_id: PropTypes.number.isRequired,
  points: PropTypes.shape({
    actual: PropTypes.number,
    expected: PropTypes.number,
    mode: PropTypes.oneOf(["actual", "expected", "both"]).isRequired,
  }).isRequired,
};

export default Player;
