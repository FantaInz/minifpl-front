import React from "react";
import PropTypes from "prop-types";
import { Text, Input, Stack, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    } catch {
      setSubmitError(t("teamModal.invalidTeamId"));
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
          <DialogTitle>{t("teamModal.title")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text mb={4} textAlign="center">
              {t("teamModal.prompt")}
            </Text>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack spacing={4} width="full" align="center">
                <Field
                  invalid={!!errors.teamId || !!submitError}
                  errorText={errors.teamId?.message || submitError}
                >
                  <Input
                    data-testid="team-id-input"
                    placeholder={t("teamModal.placeholder")}
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
                      required: t("teamModal.errors.required"),
                      min: { value: 1, message: t("teamModal.errors.min") },
                      max: {
                        value: 12000000,
                        message: t("teamModal.errors.max"),
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
                    {t("teamModal.submitButton")}
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
