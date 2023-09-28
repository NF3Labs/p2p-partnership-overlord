import { Config, ProviderConfig } from "../constants/apiBase";
import { SDK } from "nf3-sdk";
import { ethers } from 'ethers'

let backendSDK;

export const getBackendSDK = async () => {
  try {
    if (!backendSDK) {
      const config = { ...Config };
      config.contracts = [{ "name": "VAULT", "address": "0xc514b0FDDbdab39fdD9996Ad11f37f2D76cACC2d" }, { "name": "NF3Market", "address": "0xBC881ba2A7D6aFbcd05a4EBA3e646E30E81cAa07" }, { "name": "ETH", "address": "0x0000000000000000000000000000000000000000" }, { "name": "SigningUtils", "address": "0x0C52fE9787e0EEBDC15928Da84b5e3500B7d2035" }];
      const url = ProviderConfig.providerURL + ProviderConfig.providerKey
      const provider = new ethers.providers.JsonRpcProvider(url)

      backendSDK = new SDK({ ...config, JsonRpcProvider: provider });
      await backendSDK.initializeBackend();
    }
    
    return backendSDK;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to initialize Backend SDK");
  }
};