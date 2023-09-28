import axios from "axios";
import { isAddress } from "ethers/lib/utils";
import { useState, useEffect, useRef } from "react";
import { defaultHeaders } from "../utils/fetcher";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";

export const useWalletOfOwner = (address) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const callingRef = useRef(false);
  const addressRef = useRef(address);
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const getWalletOfOwner = async (address) => {
    try {
      callingRef.current = true;
      addressRef.current = address;
      setIsError(false);
      setIsLoading(true);
      const response = await axios.get("/api/get/walletOfOwner", {
        params: {
          walletAddress: address,
        },
        headers: defaultHeaders(),
      });
      const returnedData = response.data.data;
      let cleanedERCData = [];
      returnedData?.collections.forEach((i) => {
        let tokensTemp = [];
        i.ownerships.forEach((x) => {
          let temp = { nft: x.nft, quantity: x.quantity };
          tokensTemp.push(temp);
        });
        cleanedERCData.push({
          type: i.type,
          nfts: tokensTemp,
          Amount: i.ownerships.length,
          name: i.name,
          total: i.token_count,
          whitelisted: i.is_whitelisted,
        });
      });
      setData(cleanedERCData);
      setIsLoading(false);
      callingRef.current = false;
    } catch (error) {
      console.log(error);
      callingRef.current = false;
      setIsError(true);
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

  useEffect(() => {
    if (
      (!data || addressRef.current !== address) &&
      isAddress(address) &&
      !callingRef.current
    ) {
      getWalletOfOwner(address);
    }
  }, [address, data]);

  return { data, isLoading, isError, getWalletOfOwner };
};
