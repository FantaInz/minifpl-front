import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Input } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import customStyles from "@/config/select-styles";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { usePlayers } from "@/features/search/api/search-players";

const SolverForm = ({ freeTransfers, budget, teamId, teamName, onSubmit }) => {
  const { data } = usePlayers({
    pageSize: 1000,
    pageNumber: 0,
    SortPoints: null,
  });

  const suggestions = data?.players
    ? data.players.map((player) => ({
        label: player.name,
        value: player.id.toString(),
      }))
    : [];

  const gameweeksOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const items = [
    { label: "ID zespołu", value: teamId },
    { label: "Nazwa zespołu", value: teamName },
    { label: "W banku", value: `${budget} mln` },
    { label: "Dostępne transfery", value: freeTransfers },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      planName: "",
    },
  });

  const onFormSubmit = (data) => {
    const mappedData = {
      planName: data.planName,
      weeks: data.gameweeks.value[0],
      must_have: data.playersToKeep?.map((player) => player.value - 1) || [],
      cant_have: data.playersToAvoid?.map((player) => player.value - 1) || [],
    };

    onSubmit(mappedData);
    console.log("Formularz wysłany:", mappedData);
  };

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
      width={{ base: "100%", md: "90%" }}
    >
      <DataListRoot orientation="horizontal" divideY="1px" size="lg">
        {items.map((item) => (
          <DataListItem
            pt="5"
            grow
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </DataListRoot>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack spacing={4} mt={6}>
          <Field
            label="Nazwa planu"
            invalid={!!errors.planName}
            errorText={errors.planName?.message}
          >
            <Input
              placeholder="Wpisz nazwę planu"
              width={{ base: "100%", md: "50%" }}
              {...register("planName", {
                required: "Nazwa planu jest wymagana",
                minLength: {
                  value: 3,
                  message: "Nazwa planu musi mieć co najmniej 3 znaki",
                },
              })}
            />
          </Field>

          <Field
            label="Liczba kolejek"
            invalid={!!errors.gameweeks}
            errorText={errors.gameweeks?.message}
          >
            <Controller
              name="gameweeks"
              control={control}
              rules={{
                required: "Wybierz liczbę kolejek",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={gameweeksOptions}
                  placeholder="Wybierz liczbę kolejek"
                  styles={customStyles({
                    minWidth: "200px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label="Wymagani gracze">
            <Controller
              name="playersToKeep"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={suggestions}
                  isMulti
                  placeholder="Wybierz graczy"
                  styles={customStyles({
                    minWidth: "200px",
                    maxWidth: "400px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label="Gracze do unikania">
            <Controller
              name="playersToAvoid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={suggestions}
                  isMulti
                  placeholder="Wybierz graczy"
                  styles={customStyles({
                    minWidth: "200px",
                    maxWidth: "400px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Button
            type="submit"
            colorPalette="green"
            mt={5}
            width={{ base: "50%", md: "20%" }}
            mx="auto"
          >
            Uruchom
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

SolverForm.propTypes = {
  freeTransfers: PropTypes.number.isRequired,
  budget: PropTypes.number.isRequired,
  teamId: PropTypes.number.isRequired,
  teamName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
};

export default SolverForm;
