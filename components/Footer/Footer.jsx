import {
  Box,
  Flex,
  Image,
  Stack,
  Spacer,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search } from "../Icons/Search";
import { Plus } from "../Icons/Plus";
import { useRouter } from "next/router";
import { Logo } from "../Icons/Logo";
import { Discord } from "../Icons/Discord";
import { Mail } from "../Icons/Mail";
import { Twitter } from "../Icons/Twitter";

export const Footer = () => {
  const header = useColorModeValue("header.light", "header.dark");
  const bgGradient = useColorModeValue("linear(to-r, #5D6681, #060B2D, #5D6681)");

  return (
    <Flex
      bgGradient={bgGradient}
      bottom="0"
      right="0"
      w="full"
      py="32px"
      px="40px"
      borderTop={`1px solid ${header}`}
      alignItems="center"
      justifyContent="center"
    >
      <Flex justifyContent={"center"} alignItems="center">
        <Text fontSize="12px" fontWeight="400" color="whiter" mr="8px">
          Powered by:
        </Text>
        <Logo />
      </Flex>
    </Flex>
  );
};
