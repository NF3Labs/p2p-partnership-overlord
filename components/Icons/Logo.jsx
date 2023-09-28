import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/p2p">
    <Box cursor={"pointer"}>
      <Image
        src={useColorModeValue("/images/logo.png", "/images/logo.png")}
        alt=""
        width="60px"
        height="33px"
      />
    </Box>
  </Link>
);
