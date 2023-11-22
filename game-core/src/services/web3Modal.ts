import { createWeb3Modal, EIP6963Connector } from "@web3modal/wagmi";

import { configureChains, createConfig } from "@wagmi/core";
import { polygonMumbai } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { InjectedConnector } from "@wagmi/core";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";

const projectId = "8113267d88fce267d26e0b99c63b53a6";

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: "X5TDnhDZ4rXaZMJMggXrFQ-b5cySxi4O" }),
    publicProvider(),
  ]
);

const metadata = {
  name: "EtherEchelon",
  description: "EtherEchelon Web Game",
  url: "",
  icons: [""],
};

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
  ],
  publicClient,
});

createWeb3Modal({ wagmiConfig, projectId, chains });
