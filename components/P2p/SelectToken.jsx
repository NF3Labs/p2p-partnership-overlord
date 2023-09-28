import {
  Box,
  Flex,
  Image,
  AspectRatio,
  useColorModeValue
} from "@chakra-ui/react";
import { Eliminate } from "../Icons/Eliminate";
import { PolyP2P } from "../Icons/PolyP2P";
import { EthP2P } from "../Icons/EthP2P";
import { CHAIN } from "../../constants/chain";

export const SelectToken = ({
  isEdit,
  type,
  handleRemove,
  index,
  tokenId,
  tokenImage,
  tokenLogo,
  tokenName,
  chainId,
}) => {
  const bg = useColorModeValue("lightBg.light", "lightBg.dark");
  const borderColor = useColorModeValue("border.dark");

  return (
    <Flex
      border={`1px solid`}
      borderColor={borderColor}
      borderRadius="8px"
      position="relative"
      fontFamily={"RotoFont"}
    >
      <Box py="10px" px="15px" w='full'>
        <>
          {type === "ft" ? (
            <AspectRatio ratio={1}>
              <Box
                borderRadius="8px"
                bgColor={bg}
              >
                <Image
                  m="auto"
                  h="38px"
                  src={tokenLogo}
                />
              </Box>
            </AspectRatio>
          ) : (
            <AspectRatio ratio={1}>
              <Box
                bgImage={tokenImage}
                backgroundPosition={"center"}
                backgroundRepeat={"no-repeat"}
                backgroundSize={"cover"}
                borderRadius="8px"
              />
            </AspectRatio>
          )}
        </>
        <Box mt="6px" fontSize="12px" textAlign="center" color="whiter">
          {type === "ft" ? tokenId + " " + tokenName : tokenName}
        </Box>
        <Box position="absolute" top={"14px"} left={"19px"} w="full" h="full">
          {type !== "ft" &&
            (chainId === CHAIN.toString() ? (
              <EthP2P width={"16"} />
            ) : (
              <PolyP2P width={"16"} />
            ))}
        </Box>
      </Box>
      {isEdit && (
        <Box
          zIndex={100}
          cursor='pointer'
          position="absolute"
          top={"-6px"}
          right={"-6px"}
          onClick={() => {
            handleRemove(index);
          }}
        >
          <Eliminate />
        </Box>
      )}
    </Flex>
  );
};
