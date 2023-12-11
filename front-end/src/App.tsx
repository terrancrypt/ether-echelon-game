import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CreateAccountPage from "./pages/CreateAccount/CreateAccount";
import HomePage from "./pages/HomePage/HomePage";
import SkillsPage from "./pages/Skills/SkillsPage";
import GameOnline from "./pages/GameDemo/GameOnline";
import Beasts from "./pages/Beasts/Beasts";
import BeastDetail from "./pages/BeastDetail/BeastDetail";
import FaucetPage from "./pages/Faucet/FaucetPage";
import HowToPlayPage from "./pages/HowToPlay/HowToPlayPage";
import MarketPage from "./pages/MarketPage/MarketPage";
import SettingPage from "./pages/SettingPage/SettingPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/play" element={<GameOnline />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="/game-online" element={<GameOnline />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/faucet" element={<FaucetPage />} />
        <Route path="/beasts" element={<Beasts />} />
        <Route path="/beasts/:key" element={<BeastDetail />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
