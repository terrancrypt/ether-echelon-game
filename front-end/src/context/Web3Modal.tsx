import { ReactNode } from "react";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig, configureChains } from "wagmi";
import { avalancheFuji, polygonMumbai } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const projectId = "8113267d88fce267d26e0b99c63b53a6";

const { chains, publicClient } = configureChains(
  [polygonMumbai, avalancheFuji],
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

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

interface Web3ModalProps {
  children: ReactNode;
}

export function Web3Modal({ children }: Web3ModalProps) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
