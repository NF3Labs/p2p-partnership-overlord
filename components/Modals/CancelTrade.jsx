import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";

export const CancelTrade = ({
  handleGoBack,
  handleContinue,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={useColorModeValue("bg.light", "bg.dark")}>
        <Box py="6" px="8" pos="relative">
          <Text fontSize="14px" fontWeight="bold" textAlign="center">
            Are You Sure?
          </Text>
          <Text
            fontSize="14px"
            pt="20px"
            textAlign="center"
            color={useColorModeValue("content.light", "content.dark")}
          >
            Are you sure you want to cancel this swap? <br />
            Progress will not be saved.
          </Text>
          <Flex justify="center" align="center" pt="8" gap="6">
            <Box
              border={"2px solid"}
              borderColor={"secondary"}
              borderRadius="8px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              onClick={handleGoBack}
              cursor="pointer"
            >
              NO,&nbsp;GO&nbsp;BACK
            </Box>
            <Box
              bg={"pinker"}
              color="whiter"
              borderRadius="8px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              onClick={handleContinue}
            >
              YES,&nbsp;CANCEL&nbsp;SWAP
            </Box>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
