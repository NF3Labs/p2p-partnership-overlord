import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBeautifulAddress } from "../../utils/formatters";
import { Search } from "../Icons/Search";
import { Logo } from "../Icons/Logo";
import { useUserContext } from "../../contexts/User";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { useDebounce } from "use-hooks";
import { useRouter } from "next/router";
import axios from "axios";

export const Step1 = ({ callback }) => {
  const userContext = useUserContext();

  const { chain } = useNetwork();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const { chains } = useSwitchNetwork();

  const borderColor = useColorModeValue("border.light", "border.dark");
  const title = useColorModeValue("whiter", "title.dark");
  const titleHover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const h = useColorModeValue("whiter", "placeholder.dark");
  const inputColor = useColorModeValue("transparentColor");

  const { address } = useAccount();

  const [selectHistory, setSelectHistory] = useState(-1);
  const [selectResult, setSelectResult] = useState(-1);

  const [history, setHistory] = useState([]);
  const [result, setResult] = useState([]);
  const [value, setValue] = useState("");

  const debounceValue = useDebounce(value, 500);

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (debounceValue !== "") {
      getSearchList(debounceValue);
    } else {
      setResult([]);
      setSelectResult(-1);
    }
  }, [debounceValue]);

  const getList = async () => {
    try {
      if (address === undefined) return;

      const response = await axios.get('/api/get/getP2PTraders', {
        params: {
          address: address,
        }
      });

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        cleanedData.push({
          address: i.address,
          name: i.name,
          image: i.image,
        });
      });

      setHistory(cleanedData);
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const getSearchList = async (key) => {
    try {
      if (address === undefined) return;

      const response = await axios.get('/api/get/getSearchAdd', {
        params: {
          key: key,
        }
      });

      const returnedData = response.data.data;
      let cleanedData = [];

      returnedData?.forEach((i) => {
        if (address !== i.address) {
          cleanedData.push({
            address: i.address,
            name: i.name,
            image: i.image,
          });
        }
      });

      setResult(cleanedData);
      setSelectResult(-1);
      setSelectHistory(-1);
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const handleOwner = (index, type) => {
    let temp = {};
    if (type === 2) {
      temp = result[index];
      setSelectResult(index);
      setSelectHistory(-1);
    } else {
      temp = history[index];
      setSelectHistory(index);
      setSelectResult(-1);
    }
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_TRADER",
      payload: {
        name: temp.name,
        address: temp.address,
        image: temp.image,
        isEth: chains.findIndex((i) => i.id === chain.id),
      },
    });
    userContext?.dispatchSelectedActions({
      type: "HANDLE_P2P_ME",
      payload: {
        name: "You",
        address: address,
        isEth: 0,
      },
    });
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleContinue = () => {
    if (selectHistory !== -1 || selectResult !== -1) {
      callback(1);
    }
  };

  const handleBack = () => {
    callback(-1);
  };

  return (
    <>
      <Box w="full" mt="84px">
        <Grid mx="20vh" mt="150px" templateColumns="repeat(7, 1fr)">
          <GridItem colSpan={2}>
            <Box
              border={`1px solid`}
              borderColor={borderColor}
              borderRadius="8px"
              px="12px"
              py="18px"
            >
              <Text fontSize="24px" fontWeight="700" color={title} fontFamily={"Thunder-BoldLC"}>
                {`Recent Contacts`}
              </Text>
              <Box
                mt="12px"
                h="390px"
                overflowY="auto"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: input,
                    borderRadius: "2px",
                  },
                }}
              >
                {history.map((item, index) => {
                  return (
                    <Flex
                      cursor="pointer"
                      key={index}
                      mt={index > 0 ? "12px" : ""}
                      border={`1px solid`}
                      borderColor={borderColor}
                      px="12px"
                      py="11px"
                      borderRadius="8px"
                      onClick={() => {
                        handleOwner(index, 1);
                      }}
                    >
                      <Avatar name={item.name} src={item.image} w="48px" h="48px" />
                      <Box flex="1" ml="12px" w="5%" alignSelf="center">
                        <Text
                          fontWeight="bold"
                          fontSize="20px"
                          color="whiter"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          fontFamily={"Thunder-BoldLC"}
                        >
                          {item.name}
                        </Text>
                        <Text
                          fontSize="14px"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          color="whiter"
                          fontFamily={"RotoFont"}
                        >
                          {getBeautifulAddress(item.address)}
                        </Text>
                      </Box>
                      <Flex>
                        {selectHistory === index ? (
                          <Flex
                            m="auto"
                            borderRadius="8px"
                            bg={"whiter"}
                            w="36px"
                            h="36px"
                          >
                            <CheckIcon m="auto" color={"primary"} />
                          </Flex>
                        ) : (
                          <Box
                            m="auto"
                            borderRadius="8px"
                            bg={borderColor}
                            w="36px"
                            h="36px"
                          ></Box>
                        )}
                      </Flex>
                    </Flex>
                  );
                })}
              </Box>
              <Box
                mt="12px"
                bg={
                  selectResult === -1 && selectHistory === -1
                    ? borderColor
                    : "whiter"
                }
                _hover={{ color: "primary" }}
                color={
                  selectResult === -1 && selectHistory === -1
                    ? "primary"
                    : "primary"
                }
                cursor={
                  selectResult === -1 && selectHistory === -1
                    ? "not-allowed"
                    : "pointer"
                }
                textAlign="center"
                w="full"
                py="12px"
                borderRadius="4px"
                fontSize="16px"
                fontWeight="bold"
                onClick={handleContinue}
                fontFamily={"RotoFont"}
              >
                Continue
              </Box>
            </Box>
            <Flex>
              <Text
                as="u"
                fontSize="16px"
                fontWeight="700"
                cursor="pointer"
                color={"whiter"}
                _hover={{ color: titleHover }}
                m="auto"
                mt="16px"
                onClick={handleBack}
                fontFamily={"RotoFont"}
              >
                Cancel Trade
              </Text>
            </Flex>

            <Flex justifyContent={"center"} alignItems="center" my="32px" >
              <Text fontSize="12px" fontWeight="400" color="whiter" mr="8px">
                Powered by:
              </Text>
              <Logo />
            </Flex>
          </GridItem>
          <GridItem colSpan={5}>
            <Box px="40px" py="16px">
              <Text fontSize="24px" fontWeight="bold" color="whiter" fontFamily={"Thunder-BoldLC"}>
                Who do you want to swap with?
              </Text>
              <Text fontSize="14px" color={h} mt="16px" fontFamily={"RotoFont"}>
                {`Enter the wallet address of the person you wish to swap with.`}
              </Text>
              <InputGroup mt="24px" fontFamily={"RotoFont"}>
                <InputLeftElement color={title} pl="1.5" pointerEvents="none">
                  <Search />
                </InputLeftElement>
                <Input
                  type="text"
                  color={"whiter"}
                  bg={inputColor}
                  fontSize="16px"
                  border="none"
                  placeholder="Search Username or Wallet Address"
                  _focus={{ boxShadow: "none", border: "none" }}
                  _placeholder={{ color: h }}
                  onChange={handleChange}
                  value={value}
                />
              </InputGroup>
              <Text fontSize="20px" mb="12px" color={h} mt="30px" fontFamily={"Thunder-BoldLC"}>
                Is this the user you’re looking for?
              </Text>
              <Box
                h="300px"
                overflowY="auto"
                overflowX="hidden"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "3px",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: input,
                    borderRadius: "2px",
                  },
                }}
              >
                {1 !== 1 ? (
                  <Flex mt="100px" justify="center">
                    <Box textAlign={"center"} fontFamily={"Thunder"}>
                      The address does not hold any NFTs
                    </Box>
                  </Flex>
                ) : (
                  result.map((item, index) => {
                    return (
                      <Flex
                        cursor="pointer"
                        key={index}
                        mt={index === 0 ? "" : "12px"}
                        border={`1px solid`}
                        borderColor={selectResult === index ? "whiter" : borderColor}
                        px="12px"
                        py="11px"
                        borderRadius="8px"
                        onClick={() => {
                          handleOwner(index, 2);
                        }}
                      >
                        <Avatar name={item.name} src={item.image} />
                        <Box flex="1" ml="12px" w="5%" alignSelf="center">
                          <Text
                            fontWeight="bold"
                            fontSize="16px"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            color="whiter"
                            fontFamily={"Thunder-BoldLC"}
                          >
                            {item.name}
                          </Text>
                          <Text
                            fontSize="14px"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            color="whiter"
                            fontFamily={"RotoFont"}
                          >
                            {item.address}
                          </Text>
                        </Box>
                        <Flex>
                          {selectResult === index ? (
                            <Flex
                              m="auto"
                              borderRadius="8px"
                              bg={"whiter"}
                              w="36px"
                              h="36px"
                            >
                              <CheckIcon m="auto" color={"secondary"} />
                            </Flex>
                          ) : (
                            <Box
                              m="auto"
                              borderRadius="8px"
                              bg={borderColor}
                              w="36px"
                              h="36px"
                            ></Box>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })
                )}
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};
