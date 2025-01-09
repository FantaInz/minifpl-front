import React from "react";
import PropTypes from "prop-types";
import { Spinner, Text, VStack } from "@chakra-ui/react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogRoot,
  DialogFooter,
  DialogActionTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";

const LoadingModal = ({ isOpen, text, error, onClose }) => {
  return (
    <DialogRoot
      open={isOpen}
      modal
      centered
      motionPreset="scale"
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{error ? "Błąd!" : "Proszę czekać..."}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack spacing={4} align="center" justify="center">
            {error ? (
              <Text textAlign="center">{error}</Text>
            ) : (
              <>
                <Spinner size="xl" role="status" />
                <Text textAlign="center">{text}</Text>
              </>
            )}
          </VStack>
        </DialogBody>
        {error && (
          <DialogFooter display="flex" justifyContent="center">
            <DialogActionTrigger asChild>
              <Button colorPalette="purple" onClick={onClose}>
                Wróć do solvera
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
};

LoadingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default LoadingModal;
