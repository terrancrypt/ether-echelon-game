import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Web3Modal } from "./context/Web3Modal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3Modal>
    <App />
  </Web3Modal>
);
