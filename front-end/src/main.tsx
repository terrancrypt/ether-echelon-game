import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3Modal } from "./context/Web3Modal.tsx";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3Modal>
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: "#fff",
            colorText: "#fff",
            colorPrimary: "#fff",
            fontFamily: "Press Start 2P",
            fontSize: 11,
          },
          Spin: {
            colorPrimary: "#fff",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Web3Modal>
);
