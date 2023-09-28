import {
  Box,
  Flex,
  Spacer,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  Image,
  Link
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { CheckGreen } from "../Icons/CheckGreen";
import { CHAIN } from "../../constants/chain";
import { getBeautifulAddress } from "../../utils/formatters";

export const SwapCompleted = ({
  handleContinue,
  data,
  chain,
  isOpen,
  onClose,
}) => {
  const input = useColorModeValue("input.light", "input.dark");
  const bg = useColorModeValue("outBg.dark");
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="594px"
        bgColor={bg}
      >
        <Box p="25px" pos="relative">
          <Flex>
            <Spacer />
            <Box onClick={onClose} color="whiter" cursor="pointer">
              <CloseIcon w='60px' />
            </Box>
          </Flex>
          <Text mt="10px" fontSize="24px" fontWeight="bold" color="whiter" textAlign="center">
            Swap Completed
          </Text>
          <Text
            fontSize="16px"
            pt="20px"
            textAlign="center"
            color={"whiter"}
          >
            Your P2P swap with {getBeautifulAddress(data.address)} has been completed!
          </Text>
          <Flex justify='center' mt='24px'>
            <CheckGreen width='120px' height='120px' />
          </Flex>
          <Flex mt='24px'>
            <Flex mx='auto' alignItems={'center'}>
              <Image
                src={`/images/transaction.png`}
                h='20px'
                // w='100%'
                backgroundPosition={"center"}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"contain"}
                borderRadius='8px'
              />
              {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${data.hash}` : `https://etherscan.io/tx/${data.hash}`} target="_blank"> */}
              <Link href={chain !== CHAIN ? `https://mumbai.polygonscan.com/tx/${data.hash}` : `https://goerli.etherscan.io/tx/${data.hash}`} target="_blank" color={"whiter"}>
                <Text ml='12px' fontSize='14px' color={input} noOfLines={1} w='400px'>
                  {data.hash}
                </Text>
              </Link>
            </Flex>
          </Flex>
          <Flex justify="center" align="center" pt="8" gap="6" color={"whiter"}>
            <Box
              bg="secondary"
              color="primary"
              borderRadius="8px"
              px="24px"
              py="12px"
              fontSize="14px"
              fontWeight="bold"
              cursor="pointer"
              onClick={handleContinue}
            >
              View Completed Swaps
            </Box>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
