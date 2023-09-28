import { Flex, Box } from "@chakra-ui/react";
import { MINSCREEN_WIDTH } from "../../constants/minscreenWidth";

export const DesktopOnly = () => {
  return (
    <Flex justify={"center"} align="center" h="90vh">
      <Box fontWeight={"bold"}>
        Currently Only Available For Screens {MINSCREEN_WIDTH}px or Larger.
      </Box>
    </Flex>
  );
};
