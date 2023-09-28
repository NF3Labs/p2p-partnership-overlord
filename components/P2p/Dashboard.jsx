import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import { P2p_find } from "../Icons/P2p_find";
import { P2p_select } from "../Icons/P2p_select";
import { P2p_offer } from "../Icons/P2p_offer";
import { P2p_submit } from "../Icons/P2p_submit";
import { Logo } from "../Icons/Logo";

import { Discord } from "../Icons/Discord";
import { Mail } from "../Icons/Mail";
import { Twitter } from "../Icons/Twitter";
import Image from "next/image";
import { Verified } from "../Icons/Verified";
import { GotoNf3Icon } from "../Icons/GoToNf3Icon";
import { P2PIcon } from "../Icons/P2PIcon";
// import "../../styles/global.css"

export const Dashboard = ({ onTrade }) => {
  const realBg = useColorModeValue("bg.light", "bg.dark");
  const border = useColorModeValue("border.light", "border.dark");
  const content = useColorModeValue("content.light", "content.dark");
  const outBg = useColorModeValue("outBg.light", "outBg.dark");
  const headerBottom = useColorModeValue("border.light", "border.dark");

  const list = [
    {
      title: "FIND A USER",
      content:
        "Enter the wallet address of the person you are looking to complete a swap with",
    },
    {
      title: "I'M LOOKING FOR",
      content:
        "Select the items from the other persons wallet that you wish to swap for",
    },
    {
      title: "I'M OFFERING",
      content:
        "Select the items from your own wallet that you wish to offer in the swap",
    },
    {
      title: "PREVIEW & SUBMIT",
      content:
        "Verify the swap deal before submitting to the chain for the other person to approve and complete the swap",
    },
  ];

  const faq = [
    {
      title: "What is a P2P Direct Swap?",
      content:
        "P2P Direct Swap refers to the exchange of non-fungible tokens (NFTs) and/or Fungible Tokens (FTs) between two individuals without the involvement of a centralized platform or third-party intermediary.",
    },
    {
      title: "What are cross-chain swaps?",
      content:
        "Cross-chain swaps refer to the exchange of NFTs and/or FTs between different blockchain networks, such as Polygon and Ethereum. This requires the use of bridging protocols, which enable the transfer of assets between the two networks while maintaining their unique characteristics. P2P Direct Swaps cross-chain are under development and will be released at a later date.",
    },
    {
      title:
        "Currently, which chains do we provide support for in P2P trades/swaps?",
      content:
        "We provide support for the Polygon (Matic) chain and the Ethereum chain. This allows for the exchange of NFTs between these two networks through P2P Direct Swap transactions. See section above for full list of supported tokens & collections.",
    },
    {
      title: "Is there a service fee?",
      content:
        "There are no fees for using P2P Direct Swap, just pay for the gas.",
    },
    {
      title: "How does it work?",
      content: `To learn how to swap P2P on our platform, please visit the "How to Swap P2P" section on our website. You can also ask any questions you may have in our discord.`,
    },
    {
      title: "Can I cancel a swap?",
      content:
        "Yes, you can cancel any swap offer you make through the P2P tab in your dashboard. However, please note that you can only cancel the swap offer prior to the expiration time or before the counterparty accepts or rejects your swap offer.",
    },
    {
      title:
        "I want to swap an NFT or FT that's not supported. How can I do that?",
      content: `If a token or collection is not listed under "Supported Tokens & Collections" please submit a ticket on our discord and our team will happily review the asset for approval.`,
    },
    {
      title:
        "How do I know that the asset I am requesting or I have been offered is from a verified collection?",
      content: `NF3 whitelists for swap a limited number of token & NFT collection contracts so you can be sure that the asset you have requested or have been offered is the correct one. Look out for <Verified/> to ensure that the asset is indeed verified.`,
    },
    {
      title: "When will you support Phantom wallet?",
      content:
        "We are working on Phantom wallet integration and hope to have that supported in the near future. For now, we recommend using a dedicated/segregated hot wallet such as MetaMask.",
    },
  ];

  const middle = [
    {
      title: "Ethereum",
      content: "ETH, WETH, USDC",
      image: "p2p-middle-eth.png",
    }
  ];

  return (
    <>
      <Box
        w="full"
        mt="11px"
        bgImage={"/images/bgRect.png"}
        bgSize={"cover"}
      >
        <Flex
          w="100%"
          bg={outBg}
          py="25px"
          borderBottom="1px solid"
          borderColor={headerBottom}
          justifyContent="space-between"
        >
          <Box
            fontSize="14px"
            ml="32px"
            color="whiter"
          >
            To create cross-collection swaps outside of the Overlord ecosystem, please visit NF3 Exchange.
          </Box>
          <Flex
            fontSize="16px"
            fontWeight="600"
            color={"bluer"}
            mr="32px"
            cursor="pointer"
            alignItems="center"
          >
            Go to NF3
            <Box ml="12px">
              <GotoNf3Icon />
            </Box>
          </Flex>
        </Flex>
        <Box mt="76px" align="center" justify="center">
          <Box
            fontSize="40px"
            fontWeight="700"
            color="whiter"
            fontFamily={"Thunder-BoldLC"}
          >
            OVERLORD P2P SWAPS
          </Box>
        </Box>
        <Box mt="32px" align="center" justify="center">
          <Box
            fontSize="16px"
            fontWeight="700"
            color="whiter"
            fontFamily="RotoFont"
          >
            Securely swap your ecosystem assets peer to peer
          </Box>
        </Box>
        <Box mt="51px" align="center" justify="center">
          <P2PIcon />
        </Box>
        <Box mt="53px" align="center" justify="center">
          <Box
            fontSize="24px"
            fontWeight="600"
            color="whiter"
            fontFamily={"Thunder-BoldLC"}
          >
            How to Swap P2P
          </Box>
        </Box>

        <Box
          mt="32px"
          align="center"
          justify="center"
          w="75%"
          mx="auto"
        >
          <Grid templateColumns="repeat(4, 1fr)" gap="32px">
            {list.map((i, j) => {
              return (
                <GridItem
                  key={j}
                  w="100%"
                  bg={realBg}
                  borderRadius="9px"
                  color="whiter"
                  border="1px solid"
                  borderColor={border}
                >
                  <Box my="31px" mx="12px">
                    <Flex mb="20px">
                      <Box h="80px" m="auto">
                        {j === 0 ? (
                          <P2p_find />
                        ) : j === 1 ? (
                          <P2p_select />
                        ) : j === 2 ? (
                          <P2p_offer />
                        ) : (
                          <P2p_submit />
                        )}
                      </Box>
                    </Flex>
                    <Text fontSize="20px" fontWeight="bold" textAlign="center" fontFamily={"Thunder-BoldLC"}>
                      {i.title}
                    </Text>
                    <Text
                      mt="20px"
                      fontSize="14px"
                      color={content}
                      textAlign="center"
                      fontWeight="700"
                      fontFamily={"RotoFont"}
                    >
                      {i.content}
                    </Text>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
        </Box>
        <Box mt="72px" align="center" justify="center">
          <Box
            w="260px"
            h="48px"
            bg="whiter"
            px="24px"
            py="12px"
            borderRadius="8px"
            cursor="pointer"
            onClick={onTrade}
            fontWeight="700"
            fontSize="16px"
            fontFamily={"RotoFont"}
          >
            Create new Swap
          </Box>
        </Box>
        <Flex mt="95px" mb="40px" justifyContent="center" alignItems="center">
          <Text
            fontSize="12px"
            color="whiter"
          >
            Powered by:
          </Text>
          <Box ml="8px">
            <Logo />
          </Box>
        </Flex>
      </Box>
    </>
  );
};
