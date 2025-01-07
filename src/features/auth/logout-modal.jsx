import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, HStack } from "@chakra-ui/react";

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

const LogoutModal = ({ isOpen, onConfirm, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
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
          <DialogTitle>Zakończenie sesji</DialogTitle>
        </DialogHeader>{" "}
        <DialogBody>
          <Text>
            Jesteś obecnie zalogowany. Czy na pewno chcesz się wylogować?
          </Text>
        </DialogBody>
        <DialogFooter>
          <HStack spacing={4} width="full" justify="center">
            <DialogActionTrigger asChild>
              <Button colorPalette="blue" onClick={onClose}>
                Wróć do solvera
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
