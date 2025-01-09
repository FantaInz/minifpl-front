import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { DataListItem, DataListRoot } from "@/components/ui/data-list";

const SolverForm = ({ freeTransfers, budget, teamId, teamName, onSubmit }) => {
  const items = [
    { label: "ID zespołu", value: teamId },
    { label: "Nazwa zespołu", value: teamName },
    { label: "W banku", value: `${budget} mln` },
    { label: "Dostępne transfery", value: freeTransfers },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      planName: "",
    },
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
    console.log("Formularz wysłany:", data);
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
            pt="4"
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
              border="1px solid"
              borderColor="gray.400"
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
