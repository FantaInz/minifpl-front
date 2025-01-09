import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Input, createListCollection } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { WithContext as ReactTags } from "react-tag-input";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { usePlayers } from "@/features/search/api/search-players";
import "./solver-form.css";

const SolverForm = ({ freeTransfers, budget, teamId, teamName, onSubmit }) => {
  const { data: players } = usePlayers({
    pageSize: 1000,
    pageNumber: 0,
  });

  const suggestions = players
    ? players.map((player) => ({
        id: player.id.toString(),
        text: player.name,
      }))
    : [];

  const [playersToKeep, setPlayersToKeep] = React.useState([]);
  const [playersToAvoid, setPlayersToAvoid] = React.useState([]);

  const handleDeleteKeep = (i) => {
    setPlayersToKeep(playersToKeep.filter((_, index) => index !== i));
  };

  const handleAdditionKeep = (tag) => {
    setPlayersToKeep([...playersToKeep, tag]);
  };

  const handleDeleteAvoid = (i) => {
    setPlayersToAvoid(playersToAvoid.filter((_, index) => index !== i));
  };

  const handleAdditionAvoid = (tag) => {
    setPlayersToAvoid([...playersToAvoid, tag]);
  };

  const gameweeksCollection = createListCollection({
    items: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
    ],
  });

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
      ...data,
      gameweeks: data.gameweeks.value[0],
      playersToKeep: playersToKeep.map((tag) => tag.id - 1),
      playersToAvoid: playersToAvoid.map((tag) => tag.id - 1),
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
                <SelectRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  collection={gameweeksCollection}
                >
                  <SelectTrigger width={{ base: "100%", md: "20%" }} size="sm">
                    <SelectValueText placeholder="Wybierz liczbę" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameweeksCollection.items.map((gw) => (
                      <SelectItem item={gw} key={gw.value}>
                        {gw.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              )}
            />
          </Field>

          <Field label="Wymagani gracze">
            <ReactTags
              tags={playersToKeep}
              suggestions={suggestions}
              handleDelete={handleDeleteKeep}
              handleAddition={handleAdditionKeep}
              placeholder="Dodaj graczy"
              autocomplete
              inputFieldPosition="top"
              minQueryLength="2"
            />
          </Field>

          <Field label="Gracze do unikania">
            <ReactTags
              tags={playersToAvoid}
              suggestions={suggestions}
              handleDelete={handleDeleteAvoid}
              handleAddition={handleAdditionAvoid}
              placeholder="Dodaj graczy"
              autocomplete
              inputFieldPosition="top"
              minQueryLength="2"
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
