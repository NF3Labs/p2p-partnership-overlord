import {
  Box,
  Flex,
  Text,
  Spacer,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Link,
  Image,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Exchange } from "../P2p/Exchange";
import { useCountDown } from "../../hooks/useCountDown";
import { getTimeInSecondsFromTimeString } from "../../utils/formatters";
import { useEffect, useState } from "react";
import { useERC20Balance } from "../../hooks/useERC20Balance";
import { CHAIN } from "../../constants/chain";
import { useTokenContext } from "../../contexts/Token";
import axios from "axios";
import { ethers, constants } from "ethers";
import { FeeConfiguration, ETHContract } from "../../constants/royalty_fee_configuration";

export const P2PStatus = ({
  handleGoBack,
  handleContinue,
  handleDecline,
  isProcessingAccept,
  isProcessingCancel,
  item,
  chain,
  isOpen,
  onClose,
  trade,
  handleCancelTrade,
  handleAcceptTrade,
  setBuyerFee,
  setSellerFee,
  setRoyalty,
  sellerFee,
  buyerFee,
  royalty
}) => {
  const title = useColorModeValue("whiter", "title.dark");
  const bg = useColorModeValue("outBg.dark");
  const cover = useColorModeValue("titleHover.light", "titleHover.dark");
  const input = useColorModeValue("input.light", "input.dark");
  const labelColor = useColorModeValue("tabColor.dark");
  const labelColor2 = useColorModeValue("tabColor.light");
  const tokenContext = useTokenContext();
  const borderColor = useColorModeValue("border.light");

  const { isLoaded, minutes, hours, days } = useCountDown({
    endTime: getTimeInSecondsFromTimeString(item?.end_time),
  });

  const [isFlag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusAssets, setStatusAssets] = useState(0); // 0 normal 1 owner 2 trader
  const [statusFts, setStatusFts] = useState(0);

  const { data: _right20Balance } = useERC20Balance(item?.rightOwner.address);

  const rightErc20Balance = _right20Balance && _right20Balance[chain];

  const { data: _left20Balance } = useERC20Balance(item?.leftOwner.address);

  const leftErc20Balance = _left20Balance && _left20Balance[chain];

  useEffect(() => {
    let leftAmount;
    let rightAmount;

    switch (FeeConfiguration?.case) {
      case 0:
        setSellerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
        setBuyerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
        setRoyalty({ to: [], percentage: [] });
        break;
      case 1:
        if (!((item?.rightFT?.length === 0 &&
          item?.rightNFT?.length && item?.rightNFT?.reduce((total, i) => {
            if (i?.nft?.contract?.toLocaleLowerCase() === item?.rightNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
              return total & true;
            } else {
              return total & false;
            }
          }, true) &&
          item?.leftNFT?.length === 0 &&
          item?.leftFT?.length === 1) || (item?.leftFT?.length === 0 &&
            item?.leftNFT?.length && item?.leftNFT?.reduce((total, i) => {
              if (i?.nft?.contract?.toLocaleLowerCase() === item?.leftNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
                return total & true;
              } else {
                return total & false;
              }
            }, true) &&
            item?.rightNFT?.length === 0 &&
            item?.rightFT?.length === 1))) {
          if (item?.rightFT?.length === 0 && item?.leftFT?.length === 0) {
            leftAmount = 0;
            rightAmount = 0;
          } else {
            leftAmount = item && item?.leftFT?.length ?
              item?.leftFT?.[0]?.amount * FeeConfiguration?.fee_rate / 100 : 0;
            rightAmount = item && item?.rightFT?.length ?
              item?.rightFT?.[0]?.amount * FeeConfiguration?.fee_rate / 100 : 0;
          }
        } else {
          leftAmount = 0;
          rightAmount = 0;
        }
        setSellerFee({
          token: FeeConfiguration?.fee_tokenContract, amount: ethers.utils.parseUnits(leftAmount.toString(), 18), to: FeeConfiguration?.fee_to
        });
        setBuyerFee({
          token: FeeConfiguration?.fee_tokenContract, amount: ethers.utils.parseUnits(rightAmount.toString(), 18), to: FeeConfiguration?.fee_to
        });
        setRoyalty({ to: [], percentage: [] });
        break;
      case 2:
        if ((item?.rightFT?.length === 0 &&
          item?.rightNFT?.length && item?.rightNFT?.reduce((total, i) => {
            if (i?.nft?.contract?.toLocaleLowerCase() === item?.rightNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
              return total & true;
            } else {
              return total & false;
            }
          }, true) &&
          item?.leftNFT?.length === 0 &&
          item?.leftFT?.length === 1) || (item?.leftFT?.length === 0 &&
            item?.leftNFT?.length && item?.leftNFT?.reduce((total, i) => {
              if (i?.nft?.contract?.toLocaleLowerCase() === item?.leftNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
                return total & true;
              } else {
                return total & false;
              }
            }, true) &&
            item?.rightNFT?.length === 0 &&
            item?.rightFT?.length === 1)) {
          setRoyalty({ to: FeeConfiguration?.royalty_to, percentage: FeeConfiguration?.royalty_percentage });
        } else {
          setRoyalty({ to: [], percentage: [] });
        }
        setSellerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
        setBuyerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
        break;
      case 3:
        if ((item?.rightFT?.length === 0 &&
          item?.rightNFT?.length && item?.rightNFT?.reduce((total, i) => {
            if (i?.nft?.contract?.toLocaleLowerCase() === item?.rightNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
              return total & true;
            } else {
              return total & false;
            }
          }, true) &&
          item?.leftNFT?.length === 0 &&
          item?.leftFT?.length === 1) || (item?.leftFT?.length === 0 &&
            item?.leftNFT?.length && item?.leftNFT?.reduce((total, i) => {
              if (i?.nft?.contract?.toLocaleLowerCase() === item?.leftNFT?.[0]?.nft?.contract?.toLocaleLowerCase()) {
                return total & true;
              } else {
                return total & false;
              }
            }, true) &&
            item?.rightNFT?.length === 0 &&
            item?.rightFT?.length === 1)) {
          setRoyalty({ to: FeeConfiguration?.royalty_to, percentage: FeeConfiguration?.royalty_percentage });
          setSellerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
          setBuyerFee({ token: constants.AddressZero, amount: 0, to: constants.AddressZero });
        } else {
          if (item?.rightFT?.length === 0 && item?.leftFT?.length === 0) {
            leftAmount = 0;
            rightAmount = 0;
          } else {
            leftAmount = item && item?.leftFT?.length ?
              item?.leftFT?.[0]?.amount * FeeConfiguration?.fee_rate / 100 : 0;
            rightAmount = item && item?.rightFT?.length ?
              item?.rightFT?.[0]?.amount * FeeConfiguration?.fee_rate / 100 : 0;
          }
          setRoyalty({ to: [], percentage: [] });

          setSellerFee({
            token: FeeConfiguration?.fee_tokenContract, amount: ethers.utils.parseUnits(leftAmount.toString(), 18), to: FeeConfiguration?.fee_to
          });
          setBuyerFee({
            token: FeeConfiguration?.fee_tokenContract, amount: ethers.utils.parseUnits(rightAmount.toString(), 18), to: FeeConfiguration?.fee_to
          });
        }
        break;
    }
  }, [item])

  const checkFlaggedToken = () => {
    let data = [];

    item?.rightNFT.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    item?.leftNFT.forEach((item) => {
      if (item.nft.is_flagged) {
        data.push(item);
      }
    });

    return data;
  };

  const getList = async (address, nfts) => {
    try {
      let nRet = 0;

      if (address === "" || nfts.length === 0) return 0;

      setIsLoading(true);
      const response = await axios.get('/api/get/getWalletNfts', {
        params: {
          address: address,
        }
      });

      const returnedData = response.data.data;

      returnedData?.collections.forEach((i) => {
        i.ownerships.forEach((x) => {
          let temp = nfts.filter((item) => item.nft.token === x.nft.token);

          if (temp.length > 0) {
            if (x.nft.type === 'ERC1155') {
              if (x.quantity < temp.length) {
                nRet = 0;
              } else {
                nRet += temp.length;
              }
            } else {
              nRet++;
            }
          }
        });
      });

      setIsLoading(false);
      return nRet;
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

  useEffect(() => {
    let data = checkFlaggedToken();

    if (item?.is_tab1) {
      setFlag(data.length !== 0);
      checkAssets();
    }

    tokenContext?.setTxnHash(undefined);
  }, [item]);

  useEffect(() => {
    if (item?.is_tab1) {
      checkFts();
    }
  }, [item, rightErc20Balance, leftErc20Balance]);

  const checkFts = () => {
    if (!item) return;

    const rightCount = getFtCount(0, item?.rightFT);
    const leftCount = getFtCount(1, item?.leftFT);

    if (rightCount !== 0) {
      setStatusFts(1);
    } else if (leftCount !== 0) {
      setStatusFts(2);
    } else {
      setStatusFts(0);
    }
  };

  const getFtCount = (type, fts) => {
    let nRet = 0;

    if (fts.length === 0 || !rightErc20Balance || !leftErc20Balance) return 0;

    setIsLoading(true);

    if (type === 0) {
      rightErc20Balance.forEach((item) => {
        const temp = fts.filter(
          (i) =>
            item.contract === i.ft_contract && item.balanceFormatted < i.amount
        );
        if (temp.length > 0) {
          nRet++;
        }
      });
    } else {
      leftErc20Balance.forEach((item) => {
        const temp = fts.filter(
          (i) =>
            item.contract === i.ft_contract && item.balanceFormatted < i.amount
        );
        if (temp.length > 0) {
          nRet++;
        }
      });
    }

    setIsLoading(false);
    return nRet;
  };

  const checkAssets = async () => {
    if (!item) return;

    const rightCount = await getList(item?.rightOwner.address, item?.rightNFT);
    const leftCount = await getList(item?.leftOwner.address, item?.leftNFT);

    if (rightCount < item?.rightNFT.length) {
      setStatusAssets(1);
    } else if (leftCount < item?.leftNFT.length) {
      setStatusAssets(2);
    } else {
      setStatusAssets(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="1330px"
        bg={bg}
        // fontFamily={"Thunder-BoldLC"}
        position="relative"
      >
        <Box w="full" p="25px" fontFamily={"Thunder-BoldLC"}>
          <Flex>
            <Spacer />
            <Box onClick={onClose} color="whiter" cursor="pointer">
              <CloseIcon />
            </Box>
          </Flex>
          <Box w="full" mt="12px">
            {item && (
              <Exchange
                isOwner={false}
                leftNFT={item.leftNFT}
                leftFT={item.leftFT}
                leftOwner={item.leftOwner}
                rightNFT={item.rightNFT}
                rightFT={item.rightFT}
                rightOwner={item.rightOwner}
                isEdit={false}
                isSent={item.is_sent}
                index={item.is_tab1 ? 0 : item.is_tab2 ? 1 : 2}
              />
            )}
          </Box>
          {item?.is_tab1 ? (
            <Flex>
              <Box m="auto">
                <Flex>
                  <Text
                    fontWeight="bold"
                    fontSize="24px"
                    color={title}
                    mx="auto"
                    mt="32px"
                    mb="20px"
                  >
                    Expiry Period
                  </Text>
                </Flex>
                <Flex>
                  <Flex
                    m="auto"
                    justify="center"
                    border={`1px solid ${bg}`}
                    borderRadius="4px"
                    w="237px"
                    h="40px"
                    bg={borderColor}
                  >
                    <Text m="auto" fontSize="16px" color="whiter">
                      {(days !== 0 ? days + " days" : "") +
                        " " +
                        (hours !== 0 ? hours + " hr" : "") +
                        " " +
                        (minutes !== 0 ? minutes + " min" : "")}
                    </Text>
                  </Flex>
                </Flex>
                {FeeConfiguration?.case !== 0 ?
                  <Text textAlign={"center"} fontSize="14px" color="whiter" fontWeight={500} mt="15px" fontFamily={"Thunder-BoldLC"}>
                    {
                      FeeConfiguration?.case === 1 ?
                        ethers.utils.formatUnits(buyerFee?.amount?.toString(), 18) !== '0.0' ?
                          `Fee Rate: ${ethers.utils.formatUnits(buyerFee?.amount?.toString(), 18)} wETH` :
                          "No Fee and No Royalty" :
                        FeeConfiguration?.case === 2 ?
                          royalty?.to?.length !== 0 ?
                            `Royalty: ${FeeConfiguration?.royalty_percentage?.map((i) => {
                              if (item?.rightFT?.length) {
                                return (item?.rightFT?.reduce((total, j) => {
                                  return total + Number(j?.amount)
                                }, 0) / 100) * Number(i)
                              } else {
                                return (item?.leftFT?.reduce((total, j) => {
                                  return total + Number(j?.amount)
                                }, 0) / 100) * Number(i)
                              }
                            })} wETH` :
                            "No Fee and No Royalty" :
                          FeeConfiguration?.case === 3 ?
                            ethers.utils.formatUnits(buyerFee?.amount?.toString(), 18) !== '0.0' ?
                              `Fee Rate: ${ethers.utils.formatUnits(buyerFee?.amount?.toString(), 18)} wETH ` :
                              royalty?.to?.length !== 0 ?
                                `Royalty: ${FeeConfiguration?.royalty_percentage?.map((i) => {
                                  if (item?.rightFT?.length) {
                                    return (item?.rightFT?.reduce((total, j) => {
                                      return total + Number(j?.amount)
                                    }, 0) / 100) * Number(i)
                                  } else {
                                    return (item?.leftFT?.reduce((total, j) => {
                                      return total + Number(j?.amount)
                                    }, 0) / 100) * Number(i)
                                  }
                                })} wETH` : "No Fee and No Royalty" : "No Fee and No Royalty"
                    }
                  </Text>
                  : <Text textAlign={"center"} fontSize="12px" fontWeight={500} mt="15px">No Fee and No Royalty</Text>}
                {!isLoading &&
                  (statusAssets === 1 || statusFts === 1 ? (
                    <Box mt="42px" textAlign="center">
                      {!isLoading && (
                        <Box
                          mb="36px"
                          fontSize="16px"
                          color="whiter"
                          textAlign="center"
                          fontFamily={"RotoFont"}
                        >
                          {!item?.is_sent ? (
                            <>
                              You do not have the required assets or sufficient fees in your wallet, so the swap cannot be completed.
                            </>
                          ) : (
                            <>
                              You do not have the required assets or sufficient fees in your wallet, so the swap cannot be completed.
                            </>
                          )}
                        </Box>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="3px" mb="34px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Text
                        as="u"
                        fontSize="24px"
                        color="oranger"
                        textAlign="center"
                        cursor={
                          isProcessingCancel || isProcessingAccept
                            ? "not-allowed"
                            : "pointer"
                        }
                        opacity={
                          isProcessingCancel || isProcessingAccept ? ".6" : "1"
                        }
                        fontFamily={"Thunder-BoldLC"}
                        onClick={() => {
                          if (!item?.is_sent) {
                            handleDecline();
                          } else {
                            if (!isProcessingCancel && !isProcessingAccept)
                              handleCancelTrade(item, trade);
                          }
                        }}
                      >
                        {isProcessingCancel && (
                          <>
                            <Spinner size="xs" m="-1px" />
                            &nbsp;
                          </>
                        )}
                        {!item?.is_sent ? "Decline Offer" : "Cancel Offer"}
                      </Text>
                    </Box>
                  ) : statusAssets === 2 || statusFts === 2 ? (
                    <Box mt="42px" textAlign="center">
                      {!isLoading && (
                        <Box
                          mb="36px"
                          fontSize="16px"
                          color="whiter"
                          textAlign="center"
                          fontFamily={"RotoFont"}
                        >
                          {!item?.is_sent ? (
                            <>
                              The other user does not have the required assets,
                              you cannot complete the
                              <br />
                              swap right now.
                              <br />
                              You can decline the swap.
                            </>
                          ) : (
                            <>
                              Your chosen user doesn't have the required assets or sufficient fees to complete the swap right now. You
                              <br />
                              can wait for them to add the assets or cancel the
                              offer.
                            </>
                          )}
                        </Box>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="3px" mb="34px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Text
                        as="u"
                        fontSize="14px"
                        color="oranger"
                        textAlign="center"
                        cursor={
                          isProcessingCancel || isProcessingAccept
                            ? "not-allowed"
                            : "pointer"
                        }
                        opacity={
                          isProcessingCancel || isProcessingAccept ? ".6" : "1"
                        }
                        onClick={() => {
                          if (!item?.is_sent) {
                            handleDecline();
                          } else {
                            if (!isProcessingCancel && !isProcessingAccept)
                              handleCancelTrade(item, trade);
                          }
                        }}
                        fontFamily={"RotoFont"}
                      >
                        {isProcessingCancel && (
                          <>
                            <Spinner size="xs" m="-1px" />
                            &nbsp;
                          </>
                        )}
                        {!item?.is_sent ? "Decline Offer" : "Cancel Offer"}
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {!item?.is_sent && isFlag && (
                        <Flex mt="42px">
                          {!isLoading && (
                            <Text
                              m="auto"
                              fontSize="16px"
                              color="whiter"
                              textAlign="center"
                              fontFamily={"RotoFont"}
                            >
                              This swap contains flagged assets. Are you sure
                              you want to continue with this swap ?
                            </Text>
                          )}
                        </Flex>
                      )}
                      {tokenContext?.txnHash && (
                        <Flex mt="27px">
                          <Flex mx="auto" alignItems={"center"}>
                            <Image
                              src={`/images/transaction.png`}
                              h="20px"
                              backgroundPosition={"center"}
                              backgroundRepeat={"no-repeat"}
                              backgroundSize={"contain"}
                              borderRadius="8px"
                            />
                            {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${tokenContext?.txnHash}` : `https://etherscan.io/tx/${tokenContext?.txnHash}`} target="_blank"> */}
                            <Link
                              href={
                                chain !== CHAIN
                                  ? `https://mumbai.polygonscan.com/tx/${tokenContext?.txnHash}`
                                  : `https://goerli.etherscan.io/tx/${tokenContext?.txnHash}`
                              }
                              target="_blank"
                            >
                              <Text
                                ml="12px"
                                fontSize="12px"
                                color={input}
                                noOfLines={1}
                              >
                                {tokenContext?.txnHash}
                              </Text>
                            </Link>
                          </Flex>
                        </Flex>
                      )}
                      <Flex justify="center">
                        <Flex
                          justify="center"
                          bg="transparent"
                          fontWeight="bold"
                          border="1px solid"
                          borderColor={borderColor}
                          borderRadius="8px"
                          color={borderColor}
                          w="260px"
                          h="48px"
                          mt="24px"
                          cursor={
                            isProcessingCancel || isProcessingAccept
                              ? "not-allowed"
                              : "pointer"
                          }
                          opacity={
                            isProcessingCancel || isProcessingAccept
                              ? ".6"
                              : "1"
                          }
                          _hover={
                            !isProcessingCancel &&
                            !isProcessingAccept && { opacity: "0.6" }
                          }
                          onClick={() => {
                            if (!item?.is_sent) {
                              handleDecline();
                            } else {
                              if (!isProcessingCancel && !isProcessingAccept)
                                handleCancelTrade(item, trade);
                            }
                          }}
                          fontFamily={"RotoFont"}
                        >
                          <Box m="auto" fontSize="12px">
                            {isProcessingCancel && (
                              <>
                                <Spinner size="xs" m="-1px" />
                                &nbsp;&nbsp; &nbsp;
                              </>
                            )}
                            {!item?.is_sent ? "DECLINE OFFER" : "CANCEL OFFER"}
                          </Box>
                        </Flex>
                        {!item?.is_sent && (
                          <Flex
                            justify="center"
                            bg="whiter"
                            fontWeight="bold"
                            borderRadius="8px"
                            w="260px"
                            h="48px"
                            mt="24px"
                            ml="24px"
                            cursor={
                              isProcessingAccept || isProcessingCancel
                                ? "not-allowed"
                                : "pointer"
                            }
                            _hover={
                              !isProcessingAccept &&
                              !isProcessingCancel && {
                                opacity: 0.6
                              }
                            }
                            color={"blacker"}
                            opacity={
                              isProcessingAccept || isProcessingCancel
                                ? ".6"
                                : "1"
                            }
                            onClick={() => {
                              if (!isProcessingAccept && !isProcessingCancel)
                                handleAcceptTrade(trade);
                            }}
                          >
                            <Box m="auto" fontSize="12px" fontFamily={"RotoFont"}>
                              {isProcessingAccept && (
                                <>
                                  <Spinner size="xs" m="-1px" />
                                  &nbsp;&nbsp;
                                </>
                              )}
                              APPROVE SWAP
                            </Box>
                          </Flex>
                        )}
                      </Flex>
                    </>
                  ))}
              </Box>
            </Flex>
          ) : item?.is_tab2 ? (
            <Box mt="17px">
              {item?.transactions?.length > 0 && (
                <Flex mt="3px" mb="34px">
                  <Flex mx="auto" alignItems={"center"}>
                    <Image
                      src={`/images/transaction.png`}
                      h="20px"
                      backgroundPosition={"center"}
                      backgroundRepeat={"no-repeat"}
                      backgroundSize={"contain"}
                      borderRadius="8px"
                    />
                    {/* <Link href={chain !== CHAIN ? `https://polygonscan.com/tx/${item?.transactions[0]}` : `https://etherscan.io/tx/${item?.transactions[0]}`} target="_blank"> */}
                    <Link
                      href={
                        chain !== CHAIN
                          ? `https://mumbai.polygonscan.com/tx/${item?.transactions[0]}`
                          : `https://goerli.etherscan.io/tx/${item?.transactions[0]}`
                      }
                      target="_blank"
                    >
                      <Text
                        ml="12px"
                        fontSize="14px"
                        color={borderColor}
                        noOfLines={1}
                      >
                        {item?.transactions[0]}
                      </Text>
                    </Link>
                  </Flex>
                </Flex>
              )}
              <Text
                m="auto"
                textAlign={"center"}
                fontSize="24px"
                fontWeight="bold"
                color={labelColor}
              >
                Completed
              </Text>
            </Box>
          ) : (
            <Box mt="17px">
              {item?.status !== "declined" &&
                item?.transactions?.length > 0 && (
                  <Flex mt="10px" mb="24px">
                    <Flex mx="auto" alignItems={"center"}>
                      <Image
                        src={`/images/transaction.png`}
                        h="20px"
                        backgroundPosition={"center"}
                        backgroundRepeat={"no-repeat"}
                        backgroundSize={"contain"}
                        borderRadius="8px"
                      />
                      <Link
                        href={
                          chain !== CHAIN
                            ? `https://mumbai.polygonscan.com/tx/${item?.transactions[0]}`
                            : `https://goerli.etherscan.io/tx/${item?.transactions[0]}`
                        }
                        target="_blank"
                      >
                        <Text
                          ml="12px"
                          fontSize="12px"
                          color={input}
                          noOfLines={1}
                        >
                          {item?.transactions[0]}
                        </Text>
                      </Link>
                    </Flex>
                  </Flex>
                )}
              <Text
                m="auto"
                textAlign="center"
                fontSize="24px"
                fontWeight="bold"
                color={labelColor2}
                sx={{ textTransform: "uppercase" }}
              >
                {item?.status}
              </Text>
            </Box>
          )}
        </Box>
        {isLoading && (
          <Flex
            position="absolute"
            w="full"
            h="full"
            top="0"
            left="0"
            bg={cover}
          >
            <Spinner m="auto" size="xl" />
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};
