import {
  Box,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { NF3Logo } from "../Icons/NF3Logo";

export const AcceptSign = ({
  isOpen,
  onClose,
  isLoading,
  handleGoBack,
  handleContinue,
}) => {
  const border = useColorModeValue("bg.dark", "bg.light");
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const modalBg = useColorModeValue("outBg.dark");
  const color = useColorModeValue("border.light");

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent
        bgColor={modalBg}
        borderColor={border}
        border={"2px solid"}
        p="4"
      >
        <ModalHeader
          pt="6"
          fontSize="16px"
          fontWeight="bold"
          textAlign="center"
          color="whiter"
        >
          Welcome to NF3
        </ModalHeader>
        <ModalBody p="6">
          <Flex
            flexDirection={"column"}
            gap="8"
            w="full"
            alignItems={"center"}
            justifyContent={"center"}
          >
            <NF3Logo />
            <Box textAlign={"center"} w="450px" fontSize="12px" color="whiter">
              <>
                By clicking confirm & connecting to this site, you acknowledge and understand that you should never click any links in relation to a swap with NF3 (and in general). This is a prime phishing attack vector. Swaps through NF3 will only ever be viewable through the dashboard once you are connected to the site.
                <br /><br />Please bookmark this page immediately.
                <br /><br />After you click confirm, you will be prompted to sign a message with your wallet of choice to connect to the NF3 dApp.

              </>
            </Box>
          </Flex>
          <Flex justify="center" align="center" gap="5" pt="5">
            <Button
              bg="transparent"
              color={color}
              _hover={bg}
              borderRadius="8px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              w="243px"
              h="53px"
              textAlign="center"
              onClick={handleGoBack}
              isDisabled={isLoading}
              border="1px solid"
              borderColor={color}
            >
              CANCEL
            </Button>
            <Button
              bg="whiter"
              color="blacker"
              _hover={{ bg: "pinkerHover" }}
              borderRadius="4px"
              py="4"
              px="6"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              w="243px"
              h="53px"
              textAlign="center"
              onClick={handleContinue}
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="Wait"
              border="1px solid"
              borderColor={color}
            >
              ACCEPT AND SIGN
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
