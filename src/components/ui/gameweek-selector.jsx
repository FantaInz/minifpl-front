import React from "react";
import PropTypes from "prop-types";
import { Stack, Heading, HStack } from "@chakra-ui/react";
import { RadioCardItem, RadioCardRoot } from "@/components/ui/radio-card";

const GameweekSelector = ({ gameweeks, selectedGameweek, onChange }) => {
  return (
    <Stack gap="4">
      <Heading size="2xl" mx="auto">
        Wybierz kolejkę
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
