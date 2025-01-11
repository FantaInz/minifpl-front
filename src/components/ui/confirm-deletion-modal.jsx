import React from "react";
import PropTypes from "prop-types";
import { Text } from "@chakra-ui/react";

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";

const ConfirmDeletionModal = ({ onConfirm, title }) => {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (onConfirm) {
        await onConfirm();
      }
      setOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot
      modal
      centered
      motionPreset="scale"
      closeOnInteractOutside={!isLoading}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogTrigger asChild>
        <Button colorPalette="red">Usuń plan</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usuwanie planu</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text fontSize="lg">
            Czy na pewno chcesz usunąć plan o nazwie <strong>{title}</strong>?
          </Text>
        </DialogBody>
        <DialogFooter justifyContent="center">
          <DialogActionTrigger asChild>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              loading={isLoading}
            >
              Anuluj
            </Button>
          </DialogActionTrigger>
          <Button
            colorPalette="red"
            onClick={handleConfirm}
            loading={isLoading}
          >
            Usuń
          </Button>
        </DialogFooter>
        {!isLoading && <DialogCloseTrigger />}
      </DialogContent>
    </DialogRoot>
  );
};

ConfirmDeletionModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default ConfirmDeletionModal;
