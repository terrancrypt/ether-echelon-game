import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import { Web3Modal } from "@/context/Web3Modal";
import Header from "@/components/Header/Header";
import "@/styles/globals.css";
import theme from "@/styles/themeConfig";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Web3Modal>
      <Header />
      <Component {...pageProps} />
    </Web3Modal>
  </ConfigProvider>
);

export default App;
