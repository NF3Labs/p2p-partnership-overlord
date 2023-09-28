import {
  Box,
  Grid,
  GridItem,
  Avatar,
  Flex,
  Text
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { Step2Me } from "./Step2Me";
import { useUserContext } from "../../contexts/User";
import { useAccount } from "wagmi";

const steps = [
  { label: "1", description: "Find A User" },
  { label: "2", description: "I'm Looking For" },
  { label: "3", description: "I'm Offering" },
  { label: "4", description: "Preview And Submit" },
];

export const Progress = ({ callback }) => {
  const bg = useColorModeValue("border.light", "border.dark");
  const selecter = useColorModeValue("selecter.dark", "header.dark");
  const label = useColorModeValue("labelColor");

  const [tab, setTab] = useState(0);
  const { address } = useAccount();
  const userContext = useUserContext();

  useEffect(() => {
    if (address === undefined) {
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });

      callback();
    } else {
      if (address !== userContext?.selectedActionsState?.p2p_me?.address) {
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_ME",
          payload: {
            ...userContext?.selectedActionsState?.p2p_me,
            ["address"]: address,
          },
        });

        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_NFT",
          payload: [],
        });
        userContext?.dispatchSelectedActions({
          type: "HANDLE_P2P_MY_FT",
          payload: [],
        });
      } else if (
        address !== userContext?.selectedActionsState?.p2p_trader?.address
      ) {
        setTab(0);
        userContext?.dispatchSelectedActions({
          type: "RESET",
        });
      }
    }
  }, [address]);

  const handleStep = (index, isEdit = false) => {
    if (index === -1) {
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });

      callback();
    } else {
      setTab(index);
    }
  };

  return (
    <>
      <Box
        w="full"
        bgImage={"/images/bgRect.png"}
        bgSize={"cover"}
      >
        <Box display={"flex"} flexDirection="column">
          {/* <Text
            textAlign={"center"}
            mt='15px'
            mb="40px"
            fontWeight="700"
            fontStyle={"normal"}
            fontSize={"30px"}
            lineHeight={"100%"}
          >
            SECURELY SWAP YOUR PIXELMON NFT(S) PEER TO PEER WITH 0% FEES
          </Text> */}
          <Grid mx="40vh" mt="70px" templateColumns="repeat(3, 1fr)">
            {new Array(3).fill(0).map((item, index) => {
              return (
                <GridItem key={index} h="2px" bg={selecter} position="relative" bg={bg}>
                  <Box
                    w={tab <= index ? "0px" : "full"}
                    h="full"
                    bg="whiter"
                    sx={{ transition: "width 0.5s ease-in" }}
                  />
                  <Box
                    position="absolute"
                    top="-17px"
                    left="-100px"
                    textAlign="center"
                  >
                    <Flex
                      display="inline-block"
                      borderRadius="8px"
                      bg={index <= tab ? "whiter" : bg}
                      sx={{ transition: "all 0.5s ease-in" }}
                    >
                      <Avatar
                        m="auto"
                        fontSize="24px"
                        fontWeight="bold"
                        pt="2px"
                        name={steps[index].label}
                        color={
                          index <= tab ? "blacker" : label
                        }
                        bg={index <= tab ? "whiter" : bg}
                        border="none"
                        sx={{ transition: "all 0.5s ease-in" }}
                        w="38px"
                        h="38px"
                      />
                    </Flex>
                    <Box
                      mt="16px"
                      fontSize="24px"
                      fontWeight="800"
                      px="40px"
                      py="8px"
                      borderRadius="8px"
                      fontFamily={"Thunder-BoldLC"}
                      color={tab >= index ? "whiter" : label}
                    >
                      {steps[index].description}
                    </Box>
                  </Box>
                  {index === 2 && (
                    <Box
                      key={4}
                      position="absolute"
                      top="-17px"
                      right="-120px"
                      textAlign="center"
                    >
                      <Flex
                        display="inline-block"
                        borderRadius="8px"
                        bg={tab >= index + 1 ? "whiter" : bg}
                        sx={{ transition: "all 0.5s ease-in" }}
                      >
                        <Avatar
                          m="auto"
                          fontSize="24px"
                          fontWeight="bold"
                          pt="2px"
                          name={steps[index + 1].label}
                          color={
                            index <= tab ? "blacker" : label
                          }
                          bg={tab >= index + 1 ? "whiter" : bg}
                          border="none"
                          sx={{ transition: "all 0.5s ease-in" }}
                          w="38px"
                          h="38px"
                        />
                      </Flex>
                      <Box
                        mt="16px"
                        fontSize="24px"
                        fontWeight="800"
                        px="38px"
                        py="7px"
                        borderRadius="8px"
                        color={tab >= index ? "whiter" : label}
                        fontFamily={"Thunder-BoldLC"}
                      >
                        {steps[index + 1].description}
                      </Box>
                    </Box>
                  )}
                </GridItem>
              );
            })}
          </Grid>
        </Box>
        {tab === 0 ? (
          <Step1 callback={handleStep} />
        ) : tab === 2 ? (
          <Step2Me callback={handleStep} />
        ) : tab === 1 ? (
          <Step2 callback={handleStep} />
        ) : tab === 3 ? (
          <Step3 callback={handleStep} />
        ) : tab === 4 ? (
          <Step4 callback={handleStep} />
        ) : (
          <></>
        )}
      </Box>
    </>
  );
};
