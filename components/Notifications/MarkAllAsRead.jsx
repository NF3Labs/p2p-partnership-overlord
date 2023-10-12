import { Button } from "@chakra-ui/react";
import { IoCheckmarkSharp } from "react-icons/io5";

export const MarkAllAsRead = (props, isMobile) => {
  if (isMobile) {
    return (
      <Button
        {...props}
        variant={"ghost"}

        color="#8C8C8C"
        // textTransform={"uppercase"}
        // rightIcon={<IoCheckmarkSharp color="#8C8C8C" fontSize={"17px"} />}
        _hover={{ opacity: "0.6" }}
        _focus={{ bg: "transparent" }}
        fontSize="12px"
        px="0px"
        height="30px"
      >
        Mark all as Read

      </Button>
    );
  }
  else {
    return (
      <Button
        {...props}
        variant={"ghost"}

        color="#8C8C8C"
        // textTransform={"uppercase"}
        // rightIcon={<IoCheckmarkSharp color="#8C8C8C" fontSize={"17px"} />}
        _hover={{ bg: "" }}
        _focus={{ bg: "transparent" }}
        fontSize="12px"
        px="0px"
        height="30px"
      >
        Mark all as Read

      </Button>
    );
  }
};