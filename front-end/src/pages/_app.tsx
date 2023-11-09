import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import { Web3Modal } from "@/context/Web3Modal";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider>
    <Web3Modal>
      <Component {...pageProps} />
    </Web3Modal>
  </ConfigProvider>
);

export default App;
