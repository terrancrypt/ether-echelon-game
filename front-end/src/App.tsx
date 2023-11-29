import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CreateAccountPage from "./pages/CreateAccount/CreateAccount";
import HomePage from "./pages/HomePage/HomePage";
import GamePage from "./pages/GamePage/GamePage";
import SkillsPage from "./pages/Skills/SkillsPage";
import { useEffect } from "react";
import { initFireBase } from "./services/firebase/firebase";

function App() {
  useEffect(() => {
    initFireBase();
  }, []);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
