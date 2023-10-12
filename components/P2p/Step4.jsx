import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { CheckGreen } from "../Icons/CheckGreen";
import { Logo } from "../Icons/Logo";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useUserContext } from "../../contexts/User";

export const Step4 = () => {
  const bg = useColorModeValue("border.light", "border.dark");
  const title = useColorModeValue("whiter", "title.dark");

  const router = useRouter();
  const { address } = useAccount();
  const userContext = useUserContext();

  const handleContinue = () => {
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: undefined,
    });
    router.push({
      pathname: `/`,
    });
  };

  return (
    <>
      <Box w="full" mt="84px" fontFamily={"Thunder-BoldLC"}>
        <Flex>
          <Box m="auto" mt="120px">
            <Flex justify="center">
              <CheckGreen width="120px" height="120px" />
            </Flex>
            <Flex mt="30px">
              <Text m="auto" fontSize="24px" fontWeight="bold" color={title}>
                Swap offer submitted to
              </Text>
            </Flex>
            <Flex
              border={`2px solid`}
              borderColor={bg}
              // bg={bg}
              px="12px"
              py="11px"
              mt="12px"
              borderRadius="8px"
            >
              <Avatar
                name={
                  userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""
                }
              />
              <Box flex="1" ml="12px" w="5%" alignSelf="center">
                <Text
                  fontWeight="bold"
                  fontSize="20px"
                  color={"whiter"}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.name
                    : ""}
                </Text>
                <Text
                  fontSize="14px"
                  fontWeight="700"
                  color="whiter"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  fontFamily={"RotoFont"}
                >
                  {userContext?.selectedActionsState?.p2p_trader
                    ? userContext?.selectedActionsState?.p2p_trader.address
                    : ""}
                </Text>
              </Box>
            </Flex>
            <Flex mt="40px" fontFamily={"RotoFont"}>
              <Text m="auto" textAlign="center" fontSize="14px" fontWeight="700" color={title}>
                As we are in beta, we are working on getting notifications set
                up.
                <br />
                Until then, please use the P2P dashboard to check if your offer
                has been accepted.
              </Text>
            </Flex>
            <Flex>
              <Box
                m="auto"
                mt="40px"
                bg={title}
                _hover={{ opacity: "0.6" }}
                color={"primary"}
                cursor="pointer"
                textAlign="center"
                w="336px"
                py="14px"
                borderRadius="4px"
                fontSize="14px"
                fontWeight="bold"
                onClick={handleContinue}
                fontFamily={"RotoFont"}
              >
                Go To P2p Dashboard
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Flex justifyContent={"center"} alignItems="center" mt="32px" mb="250px" fontFamily={"Roboto"}>
          <Text fontSize="12px" fontWeight="400" color="whiter" mr="12px">
            Powered by:
          </Text>
          <Logo />
        </Flex>
      </Box>
    </>
  );
};
