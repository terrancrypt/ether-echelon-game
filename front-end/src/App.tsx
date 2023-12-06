import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CreateAccountPage from "./pages/CreateAccount/CreateAccount";
import HomePage from "./pages/HomePage/HomePage";

import SkillsPage from "./pages/Skills/SkillsPage";
import GameOnline from "./pages/GameDemo/GameOnline";
import PlayPage from "./pages/PlayPage/PlayPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/game-online" element={<GameOnline />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
