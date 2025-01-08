import React from "react";
import PropTypes from "prop-types";
import { Text, Input, Stack, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

const TeamModal = ({ isOpen, onSubmit }) => {
  const [submitError, setSubmitError] = React.useState("");
  const [isSubmittingLocal, setIsSubmittingLocal] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    trigger,
  } = useForm();

  const handleFormSubmit = async (data) => {
    setSubmitError("");
    setIsSubmittingLocal(true);

    try {
      await onSubmit(data.teamId);
      console.log("Team ID zapisane pomyślnie!");
    } catch (err) {
      setSubmitError("Nieprawidłowe Team ID. Spróbuj ponownie.");
      console.error("Błąd Team ID:", err);
    } finally {
      setIsSubmittingLocal(false);
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      modal
      centered
      motionPreset="slide-in-bottom"
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj Team ID</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text mb={4} textAlign="center">
              Podaj ID swojego zespołu w FPL, aby przejść dalej.
            </Text>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack spacing={4} width="full" align="center">
                <Field
                  invalid={!!errors.teamId || !!submitError}
                  errorText={errors.teamId?.message || submitError}
                >
                  <Input
                    data-testid="team-id-input"
                    placeholder="Wpisz ID zespołu"
                    type="number"
                    width="250px"
                    border="1px solid"
                    borderColor="gray.400"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      clearErrors("teamId");
                      setSubmitError("");
                      trigger("teamId");
                    }}
                    {...register("teamId", {
                      required: "ID jest wymagane",
                      min: { value: 1, message: "ID musi być większe od zera" },
                      max: {
                        value: 12000000,
                        message: "ID nie może być większe niż 12 milionów",
                      },
                    })}
                  />
                </Field>

                <DialogFooter>
                  <Button
                    colorPalette="blue"
                    type="submit"
                    loading={isSubmittingLocal}
                    width="150px"
                    mx="auto"
                  >
                    Zapisz
                  </Button>
                </DialogFooter>
              </Stack>
            </form>
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

TeamModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TeamModal;
