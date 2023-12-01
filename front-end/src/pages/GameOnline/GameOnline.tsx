import { useEffect } from "react";
import Overworld, { OverworldMapsData } from "./class/Overworld";
import { asGridCoord, withGrid } from "./utils/utils";
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
          npcA: new Person({
            x: withGrid(7),
            y: withGrid(10),
            src: "images/Characters/LumberJack/LumberJackSpriteSheet.png",
            behaviorLoop: [
              { type: "stand", direction: "left", time: 800 },
              { type: "stand", direction: "up", time: 800 },
              { type: "stand", direction: "right", time: 1200 },
              { type: "stand", direction: "up", time: 800 },
            ],
          }),
          npcB: new Person({
            x: withGrid(9),
            y: withGrid(10),
            src: "images/Characters/Nurse/NurseSpriteSheet.png",
            behaviorLoop: [
              { type: "walk", direction: "left" },
              { type: "stand", direction: "up", time: 800 },
              { type: "walk", direction: "up" },
              { type: "walk", direction: "right" },
              { type: "walk", direction: "down" },
            ],
          }),
        },
        walls: {
          [asGridCoord(6, 7)]: true,
          [asGridCoord(7, 7)]: true,
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
