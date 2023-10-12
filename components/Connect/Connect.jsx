import { useModal } from "connectkit";
import { Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const Connect = (props) => {

  const { setOpen } = useModal();
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <Box bg="transparent" cursor={"pointer"} onClick={setOpen} {...props}>
          <Box
            bgImage={"/images/pfp.png"}
            backgroundSize={"cover"}
            backgroundPosition={"center"}
            backgroundRepeat={"no-repeat"}
            w="32px"
            h="32px"
          />
        </Box>
      ) : (
        <Box
          onClick={setOpen}
          bg="whiter"
          borderTopRadius="8px"
          px="16px"
          py='16px'
          fontWeight='bold'
          color={'blacker'}
          cursor={"pointer"}
        >
          SIGN IN
        </Box>
      )}
    </>
  );
};
