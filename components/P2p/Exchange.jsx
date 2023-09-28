import {
  Box,
  Flex,
  Text,
  Grid,
  GridItem,
  Avatar,
  SimpleGrid,
  useColorModeValue
} from "@chakra-ui/react";
import { NFT } from "./NFT";
import { SelectToken } from "./SelectToken";
import { ExchangeGray } from "../Icons/ExchangeGray";
import { CHAIN } from "../../constants/chain";

export const Exchange = ({
  isSent,
  isEdit,
  callback,
  isOwner,
  leftNFT,
  leftFT,
  leftOwner,
  rightNFT,
  rightFT,
  rightOwner
}) => {

  const title = useColorModeValue("whiter", "title.dark");
  const input = useColorModeValue("border.light", "border.dark");

  const handleEdit = (type) => {
    callback(type === 1 ? 1 : 2, true)
  }

  return (
    <>
      <Grid templateColumns='repeat(15, 1fr)' fontFamily={"Thunder-BoldLC"}>
        <GridItem colSpan={7}>
          <Text textAlign='center' fontSize='24px' fontWeight='bold' color={input}>
            IN
          </Text>
          <Box
            mt='9px'
            border={`1px solid`}
            borderColor={input}
            borderRadius='8px'
            px='12px'
            py='16px'
          >
            <Text fontSize='24px' color={title} fontWeight='bold'>{!isSent ? 'Other User' : `Chosen User`}</Text>
            <Box mt='12px'>
              <Flex
                border={`1px solid`}
                borderColor={input}
                px='12px'
                py='16px'
                borderRadius='8px'
              >
                <Avatar name={isOwner ? 'You' : leftOwner.name} src={leftOwner.image} />
                <Box
                  flex='1'
                  ml='12px'
                  w='5%'
                  alignSelf='center'
                >
                  <Text
                    fontWeight='bold'
                    fontSize='20px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    color={title}
                  >
                    {isOwner ? 'You' : leftOwner.name}
                  </Text>
                  <Text
                    fontSize='14px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    color={title}
                    fontFamily={"RotoFont"}
                  >
                    {leftOwner.address}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              overflowY='auto'
              overflowX='hidden'
              h='310px'
              sx={{
                "&::-webkit-scrollbar": {
                  width: "3px",
                  borderRadius: "2px",
                  backgroundColor: 'transparent',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: input,
                  borderRadius: "2px",
                },
              }}>
              <Box mt='12px'>
                {leftFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='24px' color={"whiter"}>Tokens ({leftFT.length})</Text>
                  <SimpleGrid
                    minChildWidth="100px"
                    overflow="hidden"
                    spacing="12px"
                    pt="5"
                  >
                    {leftFT.map((item, index) => {
                      return <SelectToken
                        key={index}
                        isEdit={false}
                        m='auto'
                        type='ft'
                        handleRemove={(i) => {
                          handleFTRemove(i);
                        }}
                        index={index}
                        tokenId={isEdit ? item.symbol : item.ft.symbol}
                        tokenName={item.amount}
                        tokenLogo={item.ft ? item.ft.logo : item.logo}
                        tokenImage={''}
                      />
                    })}
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                  </SimpleGrid>
                </>}
              </Box>
              <Box mt='12px'>
                {leftNFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='24px' color={"whiter"}>NFTs ({leftNFT.length})</Text>
                  <SimpleGrid minChildWidth='150px' overflow='hidden' spacing='12px' pt="12px" pb="12px">
                    {leftNFT.map((item, index) => {
                      return <NFT
                        isEth={item.nft.chain === CHAIN.toString()}
                        key={index}
                        width={'150px'}
                        isEdit={false}
                        collectionName={''}
                        item={item}
                      />
                    })}
                    <Box height='100%' />
                    <Box height='100%' />
                    <Box height='100%' />
                  </SimpleGrid>
                </>}
              </Box>
            </Box>
            {isEdit && <Box
              mt='12px'
              border={`1px solid`}
              borderColor={title}
              _hover={{ border: `1px solid`, borderColor: title }}
              color={input}
              cursor='pointer'
              textAlign='center'
              w='full'
              py='14px'
              borderRadius='4px'
              fontSize='14px'
              fontWeight='bold'
              onClick={() => { handleEdit(1) }}
              fontFamily={"RotoFont"}
            >
              EDIT
            </Box>}
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Flex h='full'>
            <Box m='auto'>
              <ExchangeGray />
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={7}>
          <Text textAlign='center' fontSize='24px' fontWeight='bold' color={input}>
            OUT
          </Text>
          <Box
            mt='9px'
            border={`1px solid`}
            borderColor={input}
            borderRadius='8px'
            px='12px'
            py='16px'
          >
            <Text fontSize='24px' color={title} fontWeight='bold'>{!isOwner ? 'Your Wallet' : `Chosen User`}</Text>
            <Box mt='12px'>
              <Flex
                border={`1px solid`}
                borderColor={input}
                px='12px'
                py='16px'
                borderRadius='8px'
              >
                <Avatar name={rightOwner.name} src={rightOwner.image} />
                <Box
                  flex='1'
                  ml='12px'
                  w='5%'
                  alignSelf='center'
                >
                  <Text
                    fontWeight='bold'
                    fontSize='20px'
                    color={title}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{rightOwner.name}</Text>
                  <Text
                    fontSize='14px'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    color={title}
                    fontFamily={"RotoFont"}
                  >
                    {rightOwner.address}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box
              overflowY='auto'
              overflowX='hidden'
              h='310px'
              sx={{
                "&::-webkit-scrollbar": {
                  width: "3px",
                  borderRadius: "2px",
                  backgroundColor: 'transparent',
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: input,
                  borderRadius: "2px",
                },
              }}>
              <Box mt='20px'>
                {rightFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='24px' color={title}>Tokens ({rightFT.length})</Text>
                  <SimpleGrid
                    minChildWidth="100px"
                    overflow="hidden"
                    spacing="12px"
                    py="12px"
                  >
                    {rightFT.map((item, index) => {
                      return <SelectToken
                        key={index}
                        isEdit={false}
                        m='auto'
                        type='ft'
                        handleRemove={(i) => {
                          handleFTRemove(i);
                        }}
                        index={index}
                        tokenId={isEdit ? item.symbol : item.ft.symbol}
                        tokenName={item.amount}
                        tokenLogo={item.ft ? item.ft.logo : item.logo}
                        tokenImage={''}
                      />
                    })}
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                    <Box height="100%" />
                  </SimpleGrid>
                </>}
              </Box>
              <Box mt='20px'>
                {rightNFT.length !== 0 && <>
                  <Text fontWeight='bold' fontSize='24px' color={title}>NFTs ({rightNFT.length})</Text>
                  <SimpleGrid minChildWidth='150px' overflow='hidden' spacing='12px' pt="12px">
                    {rightNFT.map((item, index) => {
                      return <NFT
                        isEth={item.nft.chain === CHAIN.toString()}
                        key={index}
                        width={'150px'}
                        isEdit={false}
                        collectionName={''}
                        item={item}
                      />
                    })}
                    <Box height='100%' />
                    <Box height='100%' />
                    <Box height='100%' />
                  </SimpleGrid>
                </>}
              </Box>
            </Box>
            {isEdit && <Box
              mt='12px'
              border={`1px solid`}
              borderColor={title}
              _hover={{ border: `1px solid`, borderColor: title }}
              color={input}
              cursor='pointer'
              textAlign='center'
              w='full'
              py='14px'
              borderRadius='4px'
              fontSize='14px'
              fontWeight='bold'
              onClick={() => { handleEdit(2) }}
              fontFamily={"RotoFont"}
            >
              EDIT
            </Box>}
          </Box>
        </GridItem>
      </Grid>
    </>
  );
};
