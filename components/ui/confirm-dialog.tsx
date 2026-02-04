import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from '@gluestack-ui/themed';

import { BrandColors } from '@/constants/theme';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  bodyText: string;
  btnConfirm: string;
  btnCancel: string;
  onCancel?: () => void;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  bodyText,
  btnConfirm,
  btnCancel,
  onCancel,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="md">
      <ModalBackdrop />
      <ModalContent bg={BrandColors.darkGray} borderRadius="$3xl">
        <ModalHeader>
          <Text color={BrandColors.white} fontSize="$lg" fontWeight="$bold">
            {title}
          </Text>
          <ModalCloseButton>
            <Ionicons name="close" size={20} color={BrandColors.white} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text color={BrandColors.lightGray} fontSize="$md">
            {bodyText}
          </Text>
        </ModalBody>
        <ModalFooter gap="$3">
          <Button
            variant="outline"
            borderColor={BrandColors.lightGray}
            borderRadius="$full"
            onPress={handleCancel}
            flex={1}
          >
            <ButtonText color={BrandColors.lightGray}>{btnCancel}</ButtonText>
          </Button>
          <Button
            bg={BrandColors.orange}
            borderRadius="$full"
            onPress={onConfirm}
            flex={1}
          >
            <ButtonText color={BrandColors.white} fontWeight="$semibold">
              {btnConfirm}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

