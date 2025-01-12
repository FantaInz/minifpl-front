import React from "react";
import PropTypes from "prop-types";
import { LuSearch } from "react-icons/lu";
import { Input, Stack, HStack, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import Select from "react-select";
import customStyles from "@/config/select-styles";

const formatOptions = {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
};

const teams = [
  { label: "Arsenal", value: "1" },
  { label: "Aston Villa", value: "2" },
  { label: "Bournemouth", value: "3" },
  { label: "Brentford", value: "4" },
  { label: "Brighton", value: "5" },
  { label: "Chelsea", value: "6" },
  { label: "Crystal Palace", value: "7" },
  { label: "Everton", value: "8" },
  { label: "Fulham", value: "9" },
  { label: "Ipswich Town", value: "10" },
  { label: "Leicester City", value: "11" },
  { label: "Liverpool", value: "12" },
  { label: "Man City", value: "13" },
  { label: "Man Utd", value: "14" },
  { label: "Newcastle", value: "15" },
  { label: "Nott'm Forest", value: "16" },
  { label: "Southampton", value: "17" },
  { label: "Tottenham", value: "18" },
  { label: "West Ham", value: "19" },
  { label: "Wolves", value: "20" },
];

const rangeOptions = Array.from({ length: 5 }, (_, i) => ({
  label: `${i + 1}`,
  value: (i + 1).toString(),
}));

const pageSizeOptions = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "50", value: "50" },
];

const SearchForm = ({ maxWeek, onSubmit }) => {
  const { t, i18n } = useTranslation();

  const positions = [
    { label: t("searchForm.positions.goalkeeper"), value: "1" },
    { label: t("searchForm.positions.defender"), value: "2" },
    { label: t("searchForm.positions.midfielder"), value: "3" },
    { label: t("searchForm.positions.forward"), value: "4" },
  ];

  const sortByOptions = [
    {
      label: t("searchForm.sortOptions.expectedPoints"),
      value: "expectedPoints",
    },
    { label: t("searchForm.sortOptions.realPoints"), value: "realPoints" },
  ];

  const sortOrderOptions = [
    { label: t("searchForm.sortOrder.ascending"), value: "asc" },
    { label: t("searchForm.sortOrder.descending"), value: "desc" },
  ];

  const { control, watch, register, handleSubmit, reset } = useForm({
    defaultValues: JSON.parse(localStorage.getItem("searchForm")) || {
      searchQuery: "",
      minPrice: 0,
      maxPrice: 16,
      positions: [],
      teams: [],
      startGameweek: {
        label: `${t("searchForm.gameweek", { count: maxWeek - 6 })}`,
        value: (maxWeek - 6).toString(),
      },
      rangeGameweek: rangeOptions[3],
      pageSize: pageSizeOptions[1],
      sortBy: {
        label: t("searchForm.sortOptions.expectedPoints"),
        value: "expectedPoints",
      },
      sortOrder: {
        label: t("searchForm.sortOrder.descending"),
        value: "desc",
      },
      sortGameweek: {
        label: `${t("searchForm.gameweek", { count: maxWeek - 4 })}`,
        value: (maxWeek - 4).toString(),
      },
      enableSorting: false,
    },
  });

  i18n.on("languageChanged", () => {
    handleReset();
  });

  const enableSorting = watch("enableSorting");

  const handleFormSubmit = (data) => {
    const searchData = {
      teams: data.teams,
      positions: data.positions,
      name: data.searchQuery,
      minPrice: 10 * data.minPrice,
      maxPrice: 10 * data.maxPrice,
      startGameweek: data.startGameweek.value,
      rangeGameweek: data.rangeGameweek.value,
      SortPoints: data.enableSorting
        ? {
            gameweek: data.sortGameweek.value,
            order: data.sortOrder.value,
            expected: data.sortBy.value === "expectedPoints",
          }
        : null,
      sortTeam: "asc",
      sortName: "asc",
      pageSize: data.pageSize.value,
    };

    localStorage.setItem("searchForm", JSON.stringify(data));

    onSubmit(searchData);
  };

  const handleReset = () => {
    localStorage.removeItem("searchForm");
    reset({
      searchQuery: "",
      minPrice: 0,
      maxPrice: 16,
      positions: [],
      teams: [],
      startGameweek: {
        label: `${t("searchForm.gameweek", { count: maxWeek - 6 })}`,
        value: (maxWeek - 6).toString(),
      },
      rangeGameweek: rangeOptions[3],
      pageSize: pageSizeOptions[1],
      sortBy: {
        label: t("searchForm.sortOptions.expectedPoints"),
        value: "expectedPoints",
      },
      sortOrder: {
        label: t("searchForm.sortOrder.descending"),
        value: "desc",
      },
      sortGameweek: {
        label: `${t("searchForm.gameweek", { count: maxWeek - 4 })}`,
        value: (maxWeek - 4).toString(),
      },
      enableSorting: false,
    });
  };

  const gameweeksAllOptions = Array.from({ length: maxWeek }, (_, i) => ({
    label: `${t("searchForm.gameweek", { count: i + 1 })}`,
    value: (i + 1).toString(),
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="4" align="flex-start">
        <Field label={t("searchForm.labels.searchPlayers")}>
          <InputGroup
            flex="1"
            startElement={<LuSearch />}
            minW={{ base: "100%", md: "350px" }}
          >
            <Input
              placeholder={t("searchForm.placeholders.searchPlayers")}
              {...register("searchQuery")}
              bg="white"
            />
          </InputGroup>
        </Field>

        <HStack
          spacing={4}
          align="center"
          justify="space-between"
          width={{ base: "100%", md: "50%" }}
        >
          <Field label={t("searchForm.labels.minPrice")}>
            <Controller
              name="minPrice"
              control={control}
              render={({ field }) => (
                <NumberInputRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    field.onChange(value);
                  }}
                  min={0}
                  step={0.1}
                  max={16}
                  maxW={{ base: "100px", md: "80px" }}
                  bg="white"
                  allowOverflow={false}
                  formatOptions={formatOptions}
                >
                  <NumberInputField
                    placeholder={t("searchForm.placeholders.minPrice")}
                  />
                </NumberInputRoot>
              )}
            />
          </Field>
          <Field label={t("searchForm.labels.maxPrice")}>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => (
                <NumberInputRoot
                  name={field.name}
                  value={field.value}
                  onValueChange={({ value }) => {
                    field.onChange(value);
                  }}
                  min={0}
                  step={0.1}
                  max={16}
                  maxW={{ base: "100px", md: "80px" }}
                  bg="white"
                  allowOverflow={false}
                  formatOptions={formatOptions}
                >
                  <NumberInputField
                    placeholder={t("searchForm.placeholders.maxPrice")}
                  />
                </NumberInputRoot>
              )}
            />
          </Field>
        </HStack>

        <Field label={t("searchForm.labels.positions")}>
          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={positions}
                isMulti
                placeholder={t("searchForm.placeholders.positions")}
                styles={customStyles({
                  width: "100%",
                  maxWidth: "350px",
                  fontSize: "0.875rem",
                })}
                closeMenuOnSelect={false}
                value={positions.filter((option) =>
                  field.value.includes(option.value),
                )}
                onChange={(selectedOptions) =>
                  field.onChange(selectedOptions.map((option) => option.value))
                }
              />
            )}
          />
        </Field>

        <Field label={t("searchForm.labels.teams")}>
          <Controller
            name="teams"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={teams}
                isMulti
                placeholder={t("searchForm.placeholders.teams")}
                styles={customStyles({
                  width: "100%",
                  maxWidth: "350px",
                  fontSize: "0.875rem",
                })}
                closeMenuOnSelect={false}
                value={teams.filter((option) =>
                  field.value.includes(option.value),
                )}
                onChange={(selectedOptions) =>
                  field.onChange(selectedOptions.map((option) => option.value))
                }
              />
            )}
          />
        </Field>

        <HStack spacing={4} align="center" justify="space-between" width="auto">
          <Field label={t("searchForm.labels.startGameweek")}>
            <Controller
              name="startGameweek"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={gameweeksAllOptions}
                  placeholder={t("searchForm.placeholders.selectGameweek")}
                  styles={customStyles({
                    width: "130px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label={t("searchForm.labels.rangeGameweek")}>
            <Controller
              name="rangeGameweek"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={rangeOptions}
                  placeholder={t("searchForm.placeholders.selectRange")}
                  styles={customStyles({
                    width: "130px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>
        </HStack>

        <Field>
          <Controller
            name="enableSorting"
            control={control}
            render={({ field }) => (
              <Checkbox
                variant="subtle"
                colorPalette="blue"
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
              >
                {t("searchForm.labels.enableSorting")}
              </Checkbox>
            )}
          />
        </Field>

        {enableSorting && (
          <Field label={t("searchForm.labels.sortBy")}>
            <VStack spacing={4} align="stretch">
              <Controller
                name="sortBy"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={sortByOptions}
                    placeholder={t("searchForm.placeholders.selectCriteria")}
                    styles={customStyles({
                      width: "250px",
                      fontSize: "0.875rem",
                    })}
                  />
                )}
              />
              <Controller
                name="sortOrder"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={sortOrderOptions}
                    placeholder={t("searchForm.placeholders.selectOrder")}
                    styles={customStyles({
                      width: "250px",
                      fontSize: "0.875rem",
                    })}
                  />
                )}
              />
              <Controller
                name="sortGameweek"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={gameweeksAllOptions}
                    placeholder={t("searchForm.placeholders.selectGameweek")}
                    styles={customStyles({
                      width: "250px",
                      fontSize: "0.875rem",
                    })}
                  />
                )}
              />
            </VStack>
          </Field>
        )}

        <Field label={t("searchForm.labels.pageSize")}>
          <Controller
            name="pageSize"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={pageSizeOptions}
                placeholder={t("searchForm.placeholders.selectPageSize")}
                styles={customStyles({
                  fontSize: "0.875rem",
                })}
              />
            )}
          />
        </Field>

        <HStack spacing={4} mx="auto">
          <Button type="submit" colorPalette="blue">
            {t("searchForm.buttons.search")}
          </Button>
          <Button colorPalette="purple" onClick={handleReset}>
            {t("searchForm.buttons.reset")}
          </Button>
        </HStack>
      </Stack>
    </form>
  );
};

SearchForm.propTypes = {
  maxWeek: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SearchForm;
