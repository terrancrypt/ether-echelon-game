import { useEffect } from "react";
import Overworld, { OverworldMapsData } from "./class/Overworld";
import { withGrid } from "./utils/utils";
import Person from "./class/Person";

const GameOnline = () => {
  useEffect(() => {
    const initData: OverworldMapsData = {
      DemoMap: {
        lowerSrc: "src/assets/DemoMap.png",
        upperSrc: "src/assets/UpperDemoMap.png",
        gameObjects: {
          player: new Person({
            x: withGrid(6),
            y: withGrid(9),
            isPlayerControlled: true,
            src: "images/Characters/AdventureGirl/AdventurerGirlSpriteSheet.png",
          }),
          npc1: new Person({
            x: withGrid(9),
            y: withGrid(10),
            src: "images/Characters/LumberJack/LumberJackSpriteSheet.png",
          }),
        },
      },
    };

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
