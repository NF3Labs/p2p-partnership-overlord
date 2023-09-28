import {
  useEffect,
  createContext,
  useContext,
  useRef,
  useReducer,
} from "react";
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from "wagmi";
// import { ETH_MAIN_CHAIN } from "../constants/chain";
import {
  createListing,
  initialCreateListingState,
} from "../reducers/createListing";
import {
  selectedActions,
  initialSelectedActionsState,
} from "../reducers/selectedActions";
import { useWalletOfOwner } from "../hooks/useWalletOfOwner";
import { useERC20Balance } from "../hooks/useERC20Balance";
import axios from "axios";
import { API_BASE } from "../constants/apiBase";
import { defaultHeaders } from "../utils/fetcher";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";

const UserContext = createContext();

export const UserWrapper = ({ children }) => {
  const [createListingState, dispatchCreateListing] = useReducer(
    createListing,
    initialCreateListingState
  );
  const [selectedActionsState, dispatchSelectedActions] = useReducer(
    selectedActions,
    initialSelectedActionsState
  );
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const addressRef = useRef(null);
  const { chain } = useNetwork();
  const { connect, connectors } = useConnect();
  const { address, isConnected, connector } = useAccount();
  const {
    data: walletOfOwnerData,
    isLoading: walletOfOwnerIsLoading,
    isError: walletOfOwnerIsError,
    getWalletOfOwner,
  } = useWalletOfOwner(address, chain?.id);
  const {
    data: erc20Balance,
    isLoading: erc20BalanceIsLoading,
    isError: erc20BalanceIsError,
    getERC20Balance,
  } = useERC20Balance(address);

  useEffect(() => {
    if (address) {
      addressRef.current = address;
    }
  }, [address]);

  // useEffect(() => {
  //   if (address && chain.id !== ETH_MAIN_CHAIN) {
  //     switchNetwork({ chainId: ETH_MAIN_CHAIN });
  //   }
  // }, [chain, address]);

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      "nf3marketplace-connector-choice"
    );
    if (!address && connectorId !== "null") {
      const type = connectors.find((i) => i.id === connectorId);
      if (!isConnected) {
        connect({ connector: type });
      }
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address && connector) {
      window.localStorage.setItem(
        "nf3marketplace-connector-choice",
        connector.id
      );
    } else {
      dispatchCreateListing({
        type: "RESET",
      });
      dispatchSelectedActions({
        type: "RESET",
      });
    }
  }, [address, isConnected, connector]);

  const getNonce = async () => {
    try {
      if (!address) {
        console.log("no wallet found");
        return false;
      }
      const res = await axios.get("/api/get/nonce", {
        headers: defaultHeaders(),
      });
      return res.data.data;
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
      return false;
    }
  };

  const getToken = async () => {
    try {
      const res = await axios.get(`${API_BASE}auth/challenge`, {
        headers: defaultHeaders(),
      });
      return res.data;
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
      return false;
    }
  };

  const getNotifications = async () => {
    if (address) {
      try {
        const res = await axios.get(`${API_BASE}accounts/notifications`, {
          headers: defaultHeaders(),
        });
        return res.data;
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
        return false;
      }
    }
  };

  const readNotification = async (id, address) => {
    try {
      if (!id || !address) {
        console.log("no params found");
        return false;
      }

      const res = await axios.post(
        `${API_BASE}notifications/mark-read`,
        {
          id: id,
          read : true,
          address: address,
        },
        { headers: defaultHeaders() }
      );

      getNotifications();
      return res.data;
    } catch (error) {
      return false;
    }
  };

  const unreadNotification = async (id, address) => {
    try {
      if (!id || !address) {
        console.log("no params found");
        return false;
      }

      const res = await axios.post(
        `${API_BASE}notifications/mark-read`,
        {
          id: id,
          read : false,
          address: address,
        },
        { headers: defaultHeaders() }
      );

      getNotifications();
      return res.data;
    } catch (error) {
      return false;
    }
  };

  const removeNotification = async (id, address) => {
    try {
      if (!id || !address) {
        console.log("no params found");
        return false;
      }

      const res = await axios.post(
        `${API_BASE}notifications/remove`,
        {
          id: id,
          address: address,
        },
        { headers: defaultHeaders() }
      );

      getNotifications();
      return res.data;
    } catch (error) {
      return false;
    }
  };

  const settings = {
    createListingState,
    dispatchCreateListing,
    selectedActionsState,
    dispatchSelectedActions,
    walletOfOwnerData,
    walletOfOwnerIsLoading,
    walletOfOwnerIsError,
    getWalletOfOwner,
    erc20Balance,
    erc20BalanceIsLoading,
    erc20BalanceIsError,
    getERC20Balance,
    getNonce,
    getToken,
    getNotifications,
    readNotification,
    unreadNotification,
    removeNotification,
  };

  return (
    <UserContext.Provider value={settings}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
