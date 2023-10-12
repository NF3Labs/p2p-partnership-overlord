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

  const bg = useColorModeValue("outBg.light", "outBg.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const content = useColorModeValue("contet.light", "content.dark");
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bgColor={bg}>
        <Box py="6" px="8" pos="relative">
          <Text fontSize="14px" fontWeight="bold" textAlign="center" color="whiter">
            Are You Sure?
          </Text>
          <Text
            fontSize="14px"
            pt="20px"
            textAlign="center"
            color={border}
          >
            Are you sure you want to cancel this swap? <br />
            Progress will not be saved.
          </Text>
          <Flex justify="center" align="center" pt="8" gap="6">
            <Box
              border={"2px solid"}
              borderColor={border}
              borderRadius="8px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              onClick={handleGoBack}
              cursor="pointer"
              color={"whiter"}
            >
              NO,&nbsp;GO&nbsp;BACK
            </Box>
            <Box
              bg={"whiter"}
              color="blacker"
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
