import {
  Stack,
  Flex,
  Spacer,
  Box,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Text,
  color,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { P2PItem } from "../components/P2p/P2PItem";
import { useRouter } from "next/router";
import { P2PStatus } from "../components/Modals/P2PStatus";
import { useDisclosure } from "@chakra-ui/react";
import { useAccount, useNetwork, useSwitchNetwork, useDisconnect, useSigner } from "wagmi";
import { NF3Spinner } from "../components/Spinner/NF3Spinner";
import { sortListingResponse } from "../utils/formatters";
import { errorToast, infoToast } from "./_app";
import { getRequiredChain } from "../utils/ScInteractions/getChain";
import { CHAIN } from "../constants/chain";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SwapCompleted } from "../components/Modals/SwapCompleted";
import { Approve } from "../components/Modals/Approve";
import { useAppContext } from "../contexts/App"
import axios from "axios";
import { Logo } from "../components/Icons/Logo";
import { ethers, constants } from "ethers";
import { FeeConfiguration, optional } from "../constants/royalty_fee_configuration";

export default function ActiveOptions() {
  const bg = "selectedBg";
  const hoverBg = useColorModeValue("content.dark", "lightBg.dark");
  const realBg = useColorModeValue("border.light", "bg.dark");
  const color = useColorModeValue("special");
  const appContext = useAppContext();
  const router = useRouter();
  const tabColor = useColorModeValue("special");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSwapApprove,
    onOpen: onSwapApproveOpen,
    onClose: onSwapApproveClose,
  } = useDisclosure();
  const {
    isOpen: isSwapOpen,
    onOpen: onSwapOpen,
    onClose: onSwapClose,
  } = useDisclosure();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: signer } = useSigner();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAccept, setIsProcessingAccept] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const [list, setList] = useState([]);
  const [listError, setListError] = useState(false);
  const [trades, setTrades] = useState([]);
  const [modalData, setModalData] = useState(undefined);
  const [selectIndex, setSelectIndex] = useState(-1);
  const [sellerFee, setSellerFee] = useState({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
  const [buyerFee, setBuyerFee] = useState({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
  const [royalty, setRoyalty] = useState({ to: [], percentage: [] });
  const { chain } = useNetwork();
  const [status, setStatus] = useState(0);
  const { switchNetwork, chains } = useSwitchNetwork({
    onError: () => {
      errorToast(
        "Failed to switch networks !",
        "To use NF3 on Polygon, switch the newtork in your wallet's setting"
      );
    },
  });

  const [transactionHash, setTH] = useState({ address: "", hash: "" });

  const filterList = [
    { name: "Goerli", value: 0 },
    { name: "Mumbai", value: 1 },
  ];

  const [user, setUser] = useState(
    localStorage.getItem("CSRF") && JSON.parse(localStorage.getItem("CSRF"))
  );

  useEffect(() => {
    if (router && router?.query?.walletAddress !== address) {
      const newUser =
        localStorage.getItem("CSRF") &&
        JSON.parse(localStorage.getItem("CSRF"));

      if (newUser?.access_token !== user?.access_token) {
        setUser(newUser);
        router.push(`/`);
      }
    }
  });

  useEffect(() => {
    setListError(false);
    if (!address) return;

    if (tabIndex === 0) {
      getList();
    } else if (tabIndex === 1) {
      getCompleted();
    } else if (tabIndex === 2) {
      getArchived();
    }
  }, [tabIndex, address, chain]);

  const getList = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get('/api/get/getReceivedP2P', {
        params: {
          address: address,
        }
      });
      const _receivedResponse = response.data.data
      const res = await axios.get('/api/get/getCreatedP2P', {
        params: {
          address: address,
        }
      });
      const _createdResponse = res.data.data

      if (
        _createdResponse?.p2ps === undefined ||
        _receivedResponse?.p2ps === undefined
      ) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];

      _receivedResponse.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          temp.leftFT = item.fts;
          temp.leftNFT = item.nfts;

          item.swaps.forEach((swap) => {
            temp.rightFT = swap.fts;
            temp.rightNFT = swap.nfts;
          });

          temp.leftOwner = item.created_by;
          temp.rightOwner = {
            image: item.targetted_to.image,
            name: "You",
            address: item.targetted_to.address,
            isEth:
              temp.leftNFT.length > 0
                ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                : true,
          };
          temp.duration = item.duration;
          temp.end_time = item.end_time;
          temp.id = item.id;
          temp.is_sent = false;
          temp.is_tab1 = true;

          data.push(temp);
        });

      _createdResponse.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          temp.rightFT = item.fts;
          temp.rightNFT = item.nfts;

          item.swaps.forEach((swap) => {
            temp.leftFT = swap.fts;
            temp.leftNFT = swap.nfts;
          });

          temp.leftOwner = item.targetted_to;
          temp.rightOwner = {
            image: item.created_by.image,
            name: "You",
            address: address,
            isEth:
              temp.leftNFT.length > 0
                ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                : true,
          };
          temp.duration = item.duration;
          temp.end_time = item.end_time;
          temp.id = item.id;
          temp.is_sent = true;
          temp.is_tab1 = true;

          data.push(temp);
        });
      const _trades = _receivedResponse?.p2ps
        ?.filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .concat(
          _createdResponse?.p2ps?.filter((i) =>
            i.fts.length
              ? i.fts[0]?.ft_chain === chain.id.toString()
              : i.nfts[0]?.nft_chain === chain.id.toString()
          )
        );
      setTrades(_trades);
      setList(data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

  const getCompleted = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get('/api/get/getCompletedP2P', {
        params: {
          address: address,
        }
      });
      const _response = res.data.data

      if (_response?.p2ps === undefined) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];
      _response?.p2ps
        ?.filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          if (address === item.targetted_to.address) {
            temp.leftFT = item.fts;
            temp.leftNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.rightFT = swap.fts;
              temp.rightNFT = swap.nfts;
            });

            temp.rightOwner = item.targetted_to;
            temp.leftOwner = {
              image: item.created_by.image,
              name: item.created_by.name,
              address: item.created_by.address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          } else {
            temp.rightFT = item.fts;
            temp.rightNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.leftFT = swap.fts;
              temp.leftNFT = swap.nfts;
            });

            temp.leftOwner = item.targetted_to;
            temp.rightOwner = {
              image: item.created_by.image,
              name: "You",
              address: address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          }
          temp.duration = item.duration;
          temp.end_time = item.closed_time;
          temp.id = item.id;
          temp.is_sent = address === item.created_by_address;
          temp.is_tab2 = true;

          data.push(temp);
        });

      const _trades = _response?.p2ps?.filter((i) =>
        i.fts.length
          ? i.fts[0]?.ft_chain === chain.id.toString()
          : i.nfts[0]?.nft_chain === chain.id.toString()
      );

      setList(data);
      setTrades(_trades);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

  const getArchived = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get('/api/get/getArchivedP2P', {
        params: {
          address: address,
        }
      });
      const _response = res.data.data

      if (_response?.p2ps === undefined) {
        setListError(true);
        setList([]);
        setTrades([]);
        return;
      }

      const data = [];

      _response.p2ps
        .filter((i) =>
          i.fts.length
            ? i.fts[0]?.ft_chain === chain.id.toString()
            : i.nfts[0]?.nft_chain === chain.id.toString()
        )
        .forEach((item) => {
          const temp = {};

          if (address === item.targetted_to.address) {
            temp.leftFT = item.fts;
            temp.leftNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.rightFT = swap.fts;
              temp.rightNFT = swap.nfts;
            });

            temp.rightOwner = item.targetted_to;
            temp.leftOwner = {
              image: item.created_by.image,
              name: item.created_by.name,
              address: item.created_by.address,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          } else {
            temp.rightFT = item.fts;
            temp.rightNFT = item.nfts;
            temp.transactions = item.transactions;

            item.swaps.forEach((swap) => {
              temp.leftFT = swap.fts;
              temp.leftNFT = swap.nfts;
            });

            temp.leftOwner = item.targetted_to;
            temp.rightOwner = {
              name: "You",
              address: address,
              image: item.created_by.image,
              isEth:
                temp.leftNFT.length > 0
                  ? temp.leftNFT[0].nft.chain === CHAIN.toString()
                  : true,
            };
          }
          temp.duration = item.duration;
          temp.end_time = item.closed_time ? item.closed_time : item.end_time;
          temp.status = item.status;
          temp.id = item.id;
          temp.is_sent = address === item.created_by_address;
          temp.is_tab3 = true;

          data.push(temp);
        });

      const _trades = _response?.p2ps?.filter((i) =>
        i.fts.length
          ? i.fts[0]?.ft_chain === chain.id.toString()
          : i.nfts[0]?.nft_chain === chain.id.toString()
      );

      setList(data);
      setTrades(_trades);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (
        error?.response?.status === 401 &&
        window.localStorage.getItem("CSRF")
      ) {
        router.push("/p2p");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");
      }
    }
  };

  const declineP2P = async () => {
    setIsProcessingCancel(true);

    axios.post('/api/post/postDeclineP2P', {
      params: {
        address: address,
        listingId: list[selectIndex].id
      }
    })
      // sdk.api.accounts.declineP2P(address, list[selectIndex].id)
      .then(() => {
        infoToast("The offer has been declined");
        onClose();
        setSelectIndex(-1);
        getList();
        setIsProcessingCancel(false);
      })
      .catch((err) => {
        setIsProcessingCancel(false);

        router.push("/p2p");
        disconnect();
        window.localStorage.setItem("wallet-address", "");
        window.localStorage.setItem("nf3marketplace-connector-choice", null);
        window.localStorage.removeItem("CSRF");

        console.log(err);
        errorToast("Action Failed", "Could not decline offer");
      });
  };

  const handleTabsChange = (index) => {
    if (isLoading) return;

    setTabIndex(index);
  };

  const handleCreate = () => {
    window.sessionStorage.setItem("dashboard-p2p", true);
    router.push("/p2p");
  };

  const handleCheck = (index) => {
    setSelectIndex(index);
    onOpen();
  };

  const handleDecline = async () => {
    if (isLoading) return;

    await declineP2P();
  };

  const handleChat = () => { };

  const handleCancelTrade = async (item, trade) => {
    if (!item.is_sent) {
      // decline trade
      await handleDecline();
    } else {
      // cancel trade
      try {
        setIsProcessingCancel(true);
        const sdk = await appContext?.getSDK();
        const _chainId = getRequiredChain(trade.nfts, trade.fts);
        if (Number(_chainId) !== Number(chain?.id)) {
          switchNetwork(Number(_chainId));
          setIsProcessingCancel(false);
          return;
        }
        const result = await sdk.sc.p2ps.cancelListing(signer, trade);

        setTimeout(async () => {
          infoToast("Your swap has been cancelled successfully");
          onClose();
          setSelectIndex(-1);
          setIsProcessingCancel(false);
          await getList();
        }, 1000);
      } catch (error) {
        setIsProcessingCancel(false);
        console.log(error);
        errorToast("Transaction Failed", error.reason);
      }
    }
  };

  const handleAcceptTrade = async (trade) => {
    try {
      setIsProcessingAccept(true);
      const sdk = await appContext?.getSDK();
      const _chainId = getRequiredChain(trade.nfts, trade.fts);
      if (Number(_chainId) !== Number(chain?.id)) {
        switchNetwork(Number(_chainId));
        setIsProcessingAccept(false);
        return;
      }

      trade.sellerFee = sellerFee;
      trade.buyerFee = buyerFee;
      trade.royalty = royalty;

      trade.reservations = trade.reservations ? trade.reservations : [];
      const sortedListing = sortListingResponse(trade);

      console.log(sortedListing)

      const result = await sdk.sc.p2ps.directSwap(
        signer, address, sortedListing
      );

      setTimeout(async () => {
        setTH({
          address: list[selectIndex].leftOwner.address,
          hash: result.transactionHash,
        });
        infoToast("Swap succesfull");
        onClose();
        setSelectIndex(-1);
        setIsProcessingAccept(false);
        onSwapOpen();
      }, 500);
    } catch (error) {
      setIsProcessingAccept(false);
      console.log(error);
      errorToast("Transaction Failed", error.reason);
    }
  };

  const handleOptionChange = (e) => {
    switchNetwork(chains[e].id);
  };

  return (
    <>
      <SwapCompleted
        isOpen={isSwapOpen}
        onClose={() => {
          onSwapClose();
          getList();
        }}
        chain={chain?.id}
        handleContinue={() => {
          setTabIndex(1);
          onSwapClose();
        }}
        data={transactionHash}
      />
      <P2PStatus
        isOpen={isOpen}
        onClose={onClose}
        item={list[selectIndex]}
        chain={chain?.id}
        trade={trades[selectIndex]}
        handleDecline={handleDecline}
        handleCancelTrade={handleCancelTrade}
        handleAcceptTrade={handleAcceptTrade}
        isProcessingAccept={isProcessingAccept}
        isProcessingCancel={isProcessingCancel}
        setBuyerFee={setBuyerFee}
        setSellerFee={setSellerFee}
        setRoyalty={setRoyalty}
        buyerFee={buyerFee}
        sellerFee={sellerFee}
        royalty={royalty}
      />
      <Stack
        spacing="40px"
        px="47px"
        py="40px"
        minH="100vh"
        bgImage={"/images/bgRect.png"}
        // height={"100vh"}
        bgSize={"cover"}
        fontFamily={"RotoFOnt"}
      >
        <Flex mt="4px" fontSize="16px" gap="12px" justifyContent="end" borderBottom="1px solid" borderBottomColor={realBg}>
          <Box
            bg={status === 0 ? "whiter" : realBg}
            color={status === 0 ? "blacker" : color}
            px="16px"
            py="14px"
            borderTopRadius="8px"
            cursor="pointer"
            onClick={() => setStatus(0)}
          >
            P2P
          </Box>
          {/* <Box
            bg={status === 1 ? "#FFF" : realBg}
            color={status === 1 ? "#000" : color}
            px="16px"
            py="14px"
            borderTopRadius="8px"
            cursor="pointer"
            // onClick={() => setStatus(1)}
          >
            Notifications
          </Box>
          <Box
            bg={status === 2 ? "#FFF" : realBg}
            color={status === 2 ? "#000" : color}
            px="16px"
            py="14px"
            borderTopRadius="8px"
            cursor="pointer"
            // onClick={() => setStatus(2)}
          >
            Report
          </Box> */}
        </Flex>
        <Flex gap={5}>
          <Tabs
            variant="unstyled"
            isFitted
            index={tabIndex}
            onChange={handleTabsChange}
          >
            <TabList bg={bg} borderRadius="8px">
              <Tab
                py="15px"
                px="32px"
                borderLeftRadius="8px"
                fontSize="16px"
                color={tabColor}
                borderRight={"1px solid"}
                borderRightColor={tabColor}
                _selected={{
                  color: "blacker",
                  bg: "whiter",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Active
              </Tab>
              <Tab
                py="15px"
                px="32px"
                fontSize="16px"
                color={tabColor}
                borderRight={"1px solid"}
                borderRightColor={tabColor}
                _selected={{
                  color: "blacker",
                  bg: "whiter",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Completed
              </Tab>
              <Tab
                py="15px"
                px="32px"
                fontSize="16px"
                borderRightRadius="8px"
                color={tabColor}
                _selected={{
                  color: "blacker",
                  bg: "whiter",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Archived
              </Tab>
            </TabList>
          </Tabs>
          <Spacer />
          <Box
            px="24px"
            py="14px"
            justifyContent="center"
            fontSize="16px"
            fontWeight="bold"
            borderRadius="8px"
            bg="whiter"
            _hover={{ opacity: "0.6" }}
            color="primary"
            cursor={"pointer"}
            onClick={handleCreate}
          >
            Create New Swap
          </Box>
        </Flex>
        <Box>
          {isLoading ? (
            <Box>
              <NF3Spinner />
            </Box>
          ) : listError ? (
            <Flex py="10vh" justifyContent="center" align="center">
              <Box textAlign={"center"} fontSize="24px" color="whiter">An Error Occurred Retrieving Items</Box>
            </Flex>
          ) : list.length === 0 ? (
            <Flex py="10vh" justifyContent="center" align="center">
              <Box textAlign={"center"} fontSize="24px" color="whiter">No Items Found</Box>
            </Flex>
          ) : (
            list.map((item, index) => {
              return (
                <P2PItem
                  key={index}
                  tabIndex={tabIndex}
                  item={item}
                  index={index}
                  onChat={handleChat}
                  onCheck={handleCheck}
                />
              );
            })
          )}
        </Box>
        <Flex
          bottom="0"
          right="0"
          w="full"
          py="32px"
          px="40px"
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
      </Stack>
      {isSwapApprove && (
        <Approve
          data={modalData}
          isOpen={isSwapApprove}
          onClose={onSwapApproveClose}
          handleContinue={handleAcceptTrade}
        />
      )}
    </>
  );
}
