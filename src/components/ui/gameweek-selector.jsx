import React from "react";
import PropTypes from "prop-types";
import { Stack, Heading, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";

const GameweekSelector = ({ gameweeks, selectedGameweek, onChange }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="4">
      <Heading size="2xl" mx="auto">
        {t("gameweekSelector.heading")}
      </Heading>
      <RadioCardRoot
        align="center"
        margin="auto"
        defaultValue={selectedGameweek?.toString()}
        onValueChange={(e) => onChange(e.value)}
      >
        <HStack align="stretch">
          {gameweeks.map((gw) => (
            <RadioCardItem
              key={gw.value}
              value={gw.value}
              label={gw.label}
              maxW="50px"
              maxH="50px"
              bg="white"
              indicator={false}
              borderRadius="md"
              shadow="lg"
              cursor="pointer"
              justifyContent="center"
            />
          ))}
        </HStack>
      </RadioCardRoot>
    </Stack>
  );
};

GameweekSelector.propTypes = {
  gameweeks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedGameweek: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default GameweekSelector;
