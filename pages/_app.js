import "../styles/globals.css";
import "focus-visible/dist/focus-visible";
import { TokenWrapper } from "../contexts/Token";
import { UserWrapper } from "../contexts/User";
import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { createStandaloneToast } from "@chakra-ui/toast";
import theme from "../styles/theme";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { WagmiConfig, createClient, configureChains, goerli } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Layout } from "../components/Layout/Layout";
import { AppWrapper } from "../contexts/App";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, polygonMumbai],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
      priority: 1,
    }),
    publicProvider({ priority: 2 }),
  ]
);

const wagmiClient = createClient(
  getDefaultClient({
    appName: "NF3 Marketplace",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    chains: [goerli, polygonMumbai],
    autoConnect: false,
  }),
  {
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          shimDisconnect: true,
          shimChainChangedDisconnect: true,
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "NF3 Marketplace",
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
          shimChainChangedDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  }
);

const { toast } = createStandaloneToast();

export default function App({ Component, pageProps }) {
  // const colorModeManager = cookieStorageManagerSSR(cookies);

  return (
    <WagmiConfig client={wagmiClient}>
      <ChakraProvider theme={theme}>
        <ConnectKitProvider>
          <AppWrapper>
            <UserWrapper>
              <TokenWrapper>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </TokenWrapper>
            </UserWrapper>
          </AppWrapper>
        </ConnectKitProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

App.getInitialProps = (data) => {
  const { ctx } = data;
  return {
    cookies: ctx?.req?.headers?.cookie || "",
  };
};

export const infoToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "info",
    duration: 3500,
    isClosable: true,
    position: "top-right",
    variant: "toast",
  });
};

export const errorToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "error",
    duration: 3500,
    isClosable: true,
    position: "top-right",
    variant: "toast",
  });
};

export const warningToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "warning",
    duration: 3500,
    isClosable: true,
    position: "top-right",
    variant: "toast",
  });
};

export const successToast = (title, message) => {
  toast({
    title: title,
    description: message,
    status: "success",
    duration: 3500,
    isClosable: true,
    position: "top-right",
    variant: "toast",
  });
};
