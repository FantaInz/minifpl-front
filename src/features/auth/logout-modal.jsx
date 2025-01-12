import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogActionTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogoutButton } from "@/components/ui/logout-button";
import { toaster } from "@/components/ui/toaster";

const LogoutModal = ({ isOpen, onConfirm, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toaster.create({
        title: t("logoutModal.successMessage"),
        type: "success",
      });
    } catch {
      toaster.create({
        title: t("logoutModal.errorMessage"),
        type: "error",
      });
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
          <DialogTitle>{t("logoutModal.title")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>{t("logoutModal.body")}</Text>
        </DialogBody>
        <DialogFooter>
          <HStack spacing={4} width="full" justify="center">
            <DialogActionTrigger asChild>
              <Button colorPalette="blue" onClick={onClose}>
                {t("logoutModal.returnButton")}
              </Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <LogoutButton onClick={handleLogout} isLoading={isLoading} />
            </DialogActionTrigger>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

LogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogoutModal;
