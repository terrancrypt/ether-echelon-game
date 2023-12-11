import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3Modal } from "./context/Web3Modal.tsx";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
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
            Modal: {
              fontFamily: "Press Start 2P",
              fontSize: 10,
              titleFontSize: 12,
            },
            Tooltip: {
              fontFamily: "Press Start 2P",
              fontSize: 11,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Web3Modal>
  </Provider>
);
