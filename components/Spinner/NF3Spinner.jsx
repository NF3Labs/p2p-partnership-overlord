import { Flex, Box } from "@chakra-ui/react";
import { NF3Logo } from "../Icons/NF3Logo";

export const NF3Spinner = (props) => {
  return (
    <Flex w="full" justifyContent={"center"} {...props}>
      <Box w="34px" className="rotating">
        <NF3Logo />
      </Box>
    </Flex>
  );
};
