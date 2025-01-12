import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Input } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import customStyles from "@/config/select-styles";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";
import { usePlayers } from "@/features/search/api/search-players";

const SolverForm = ({ freeTransfers, budget, teamId, teamName, onSubmit }) => {
  const { t } = useTranslation();
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
    { label: t("solverForm.teamId"), value: teamId },
    { label: t("solverForm.teamName"), value: teamName },
    { label: t("solverForm.budget"), value: `${budget} mln` },
    { label: t("solverForm.freeTransfers"), value: freeTransfers },
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
            label={t("solverForm.planName")}
            invalid={!!errors.planName}
            errorText={errors.planName?.message}
          >
            <Input
              placeholder={t("solverForm.planNamePlaceholder")}
              width={{ base: "100%", md: "50%" }}
              {...register("planName", {
                required: t("solverForm.planNameRequired"),
                minLength: {
                  value: 3,
                  message: t("solverForm.planNameMinLength"),
                },
              })}
            />
          </Field>

          <Field
            label={t("solverForm.gameweeks")}
            invalid={!!errors.gameweeks}
            errorText={errors.gameweeks?.message}
          >
            <Controller
              name="gameweeks"
              control={control}
              rules={{
                required: t("solverForm.gameweeksRequired"),
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={gameweeksOptions}
                  placeholder={t("solverForm.gameweeksPlaceholder")}
                  styles={customStyles({
                    minWidth: "200px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label={t("solverForm.mustHavePlayers")}>
            <Controller
              name="playersToKeep"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={suggestions}
                  isMulti
                  placeholder={t("solverForm.mustHavePlaceholder")}
                  styles={customStyles({
                    minWidth: "200px",
                    maxWidth: "400px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label={t("solverForm.avoidPlayers")}>
            <Controller
              name="playersToAvoid"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={suggestions}
                  isMulti
                  placeholder={t("solverForm.avoidPlaceholder")}
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
            {t("solverForm.submitButton")}
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
