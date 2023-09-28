import { useEffect, useState } from "react";
import { Config } from "../constants/apiBase";
import { useProvider } from "wagmi";
import { SDK } from "nf3-sdk";
import axios from "axios";

export const useSDK = () => {
  const [data, setData] = useState();
  const provider = useProvider();

  const getSDK = async () => {
    try {
      if (data === undefined) {
        const config = { ...Config, JsonRpcProvider: provider };
        config.contracts = [{ "name": "VAULT", "address": "0xc514b0FDDbdab39fdD9996Ad11f37f2D76cACC2d" }, { "name": "NF3Market", "address": "0xBC881ba2A7D6aFbcd05a4EBA3e646E30E81cAa07" }, { "name": "ETH", "address": "0x0000000000000000000000000000000000000000" }, { "name": "SigningUtils", "address": "0x0C52fE9787e0EEBDC15928Da84b5e3500B7d2035" }];
        
        const frontendSDK = new SDK(config);
        const response = await axios.get('/api/get/getFts')
        const fts = response.data.data
        await frontendSDK.intializeFrontend(fts);

        setData(frontendSDK);

        return frontendSDK;
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSDK();
  }, [provider]);

  return {
    getSDK,
    data,
  };
};
