import { useEffect } from "react";
import Overworld, { OverworldMapsData } from "./class/Overworld";
import "./gameStyle.css";
import initData from "./initData";

const GameOnline = () => {
  useEffect(() => {
    const overworld = new Overworld({
      element: document.querySelector(".game-online-container"),
    });
    overworld.init(initData);
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="game-online-container scale-[3] relative outline">
        <canvas className="game-online-canvas "></canvas>
      </div>
    </div>
  );
};

export default GameOnline;
