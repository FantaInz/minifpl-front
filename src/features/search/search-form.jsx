import React from "react";
import PropTypes from "prop-types";
import { LuSearch } from "react-icons/lu";
import { Input, Stack, HStack, VStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { useForm, Controller } from "react-hook-form";

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

const positions = [
  { label: "Bramkarz", value: "1" },
  { label: "Obrońca", value: "2" },
  { label: "Pomocnik", value: "3" },
  { label: "Napastnik", value: "4" },
];

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

const sortOrderOptions = [
  { label: "Rosnąco", value: "asc" },
  { label: "Malejąco", value: "desc" },
];

const sortByOptions = [
  { label: "Punkty przewidywane", value: "expectedPoints" },
  { label: "Punkty rzeczywiste", value: "realPoints" },
];

const SearchForm = ({ maxWeek, onSubmit }) => {
  const { control, watch, register, handleSubmit, reset } = useForm({
    defaultValues: JSON.parse(localStorage.getItem("searchForm")) || {
      searchQuery: "",
      minPrice: 0,
      maxPrice: 16,
      positions: [],
      teams: [],
      startGameweek: {
        label: `Kolejka ${maxWeek - 6}`,
        value: (maxWeek - 6).toString(),
      },
      rangeGameweek: { label: "4", value: "4" },
      pageSize: { label: "20", value: "20" },
      sortBy: { label: "Punkty przewidywane", value: "expectedPoints" },
      sortOrder: { label: "Malejąco", value: "desc" },
      sortGameweek: {
        label: `Kolejka ${maxWeek - 4}`,
        value: (maxWeek - 4).toString(),
      },
      enableSorting: false,
    },
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
    console.log("Przetworzone dane wyszukiwania:", searchData);
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
        label: `Kolejka ${maxWeek - 6}`,
        value: (maxWeek - 6).toString(),
      },
      rangeGameweek: { label: "4", value: "4" },
      pageSize: { label: "20", value: "20" },
      sortBy: { label: "Punkty przewidywane", value: "expectedPoints" },
      sortOrder: { label: "Malejąco", value: "desc" },
      sortGameweek: {
        label: `Kolejka ${maxWeek - 4}`,
        value: (maxWeek - 4).toString(),
      },
      enableSorting: false,
    });
  };

  const gameweeksAllOptions = Array.from({ length: maxWeek }, (_, i) => ({
    label: `Kolejka ${i + 1}`,
    value: (i + 1).toString(),
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="4" align="flex-start">
        <Field label="Szukaj zawodników">
          <InputGroup flex="1" startElement={<LuSearch />} minW="350px">
            <Input
              placeholder="Wpisz imię lub nazwisko piłkarza"
              {...register("searchQuery")}
              bg="white"
            />
          </InputGroup>
        </Field>

        <HStack spacing={4} align="center" justify="space-between" width="50%">
          <Field label="Minimalna cena">
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
                  maxW="80px"
                  bg="white"
                  allowOverflow={false}
                  formatOptions={formatOptions}
                >
                  <NumberInputField placeholder="Min" />
                </NumberInputRoot>
              )}
            />
          </Field>
          <Field label="Maksymalna cena" minW="150px">
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
                  maxW="80px"
                  bg="white"
                  allowOverflow={false}
                  formatOptions={formatOptions}
                >
                  <NumberInputField placeholder="Max" />
                </NumberInputRoot>
              )}
            />
          </Field>
        </HStack>

        <Field label="Pozycje">
          <Controller
            name="positions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={positions}
                isMulti
                placeholder="Wybierz pozycje"
                styles={customStyles({
                  width: "350px",
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

        <Field label="Drużyny">
          <Controller
            name="teams"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={teams}
                isMulti
                placeholder="Wybierz drużyny"
                styles={customStyles({
                  width: "350px",
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
          <Field label="Od której kolejki">
            <Controller
              name="startGameweek"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={gameweeksAllOptions}
                  placeholder="Wybierz kolejkę"
                  styles={customStyles({
                    width: "170px",
                    fontSize: "0.875rem",
                  })}
                />
              )}
            />
          </Field>

          <Field label="Ile kolejek do przodu">
            <Controller
              name="rangeGameweek"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={rangeOptions}
                  placeholder="Wybierz zakres"
                  styles={customStyles({
                    width: "170px",
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
                Włącz sortowanie
              </Checkbox>
            )}
          />
        </Field>

        {enableSorting && (
          <Field label="Sortuj według">
            <VStack spacing={4} align="stretch">
              <Controller
                name="sortBy"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={sortByOptions}
                    placeholder="Wybierz kryterium"
                    styles={customStyles({
                      width: "350px",
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
                    placeholder="Rosnąco/Malejąco"
                    styles={customStyles({
                      width: "100%",
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
                    placeholder="Wybierz kolejkę"
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

        <Field label="Rozmiar strony">
          <Controller
            name="pageSize"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={pageSizeOptions}
                placeholder="Wybierz rozmiar strony"
                styles={customStyles({
                  fontSize: "0.875rem",
                })}
              />
            )}
          />
        </Field>

        <HStack spacing={4}>
          <Button type="submit" colorPalette="blue">
            Szukaj
          </Button>
          <Button colorPalette="purple" onClick={handleReset}>
            Resetuj
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
