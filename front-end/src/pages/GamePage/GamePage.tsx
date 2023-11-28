import { useEffect, useRef, useState } from "react";
import GameLogin from "./components/GameLogin";
import {
  draw,
  drawOverworld,
  startAnimation,
  stopAnimation,
} from "./game-logic/draw";
import { Sprites } from "./game-logic/class/Sprites";
import { charactersData } from "../../data/charaters";
import { Person } from "./game-logic/class/Person";
import { Boundary } from "./game-logic/class/Boundary";
import { collisionsData } from "../../data/collisions";
import PlayerInfor from "./components/PlayerInfor";
import { initFireBase } from "../../services/firebase/firebase";
import initGame from "./game-logic/initGame";
import { UserDataType } from "../../services/firebase/UserDataType";

export interface PlayerInfor {
  tokenId: string;
  characterKey: string;
  username: string;
}

const GamePage = () => {
  const logInComponentRef = useRef<HTMLDivElement>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [playerInfor, setPlayerInfor] = useState<UserDataType | null>(null);

  // Move to canvas
  useEffect(() => {
    if (logInComponentRef.current) {
      logInComponentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logInComponentRef]);

  // Start draw canvas & game logic
  useEffect(() => {
    initFireBase();

    // const component = document.querySelector<HTMLDivElement>(
    //   "#GameLoginComponent"
    // );
    // if (component) component.style.display = "none";

    const canvas: HTMLCanvasElement | null =
      document.querySelector("#GameCanvas");

    if (canvas && isLogin && playerInfor) {
      // const offset = { x: -400, y: -700 };
      // const overworld = new Sprites(offset.x, offset.y, "images/Overworld.png");
      // const dataCharacter = charactersData[playerInfor.characterKey];
      // const collisionsMap = [];
      // for (let i = 0; i < collisionsData.length; i += 70) {
      //   collisionsMap.push(collisionsData.slice(i, 70 + i));
      // }
      // const boundaries: Boundary[] = [];
      // collisionsMap.forEach((row: number[], i: number) => {
      //   row.forEach((symbol: number, j: number) => {
      //     if (symbol === 675)
      //       boundaries.push(new Boundary(j * 64 + offset.x, i * 64 + offset.y));
      //   });
      // });
      // const movables = [overworld, ...boundaries];
      // const player = new Person(
      //   canvas.width / 2 - 192 / 4 / 2,
      //   canvas.height / 2 - 68 / 2,
      //   dataCharacter.sprites.down,
      //   {
      //     up: dataCharacter.sprites.up,
      //     down: dataCharacter.sprites.down,
      //     left: dataCharacter.sprites.left,
      //     right: dataCharacter.sprites.right,
      //   },
      //   movables
      // );
      // drawOverworld({
      //   map: overworld,
      //   player,
      //   boundaries,
      // });

      initGame(canvas, playerInfor);
    }

    // Stop all animation if component unmounted
    return () => {
      stopAnimation("loginBackground");
      stopAnimation("overworld");
    };
  }, [isLogin]);

  return (
    <div className="game-container flex items-center justify-center">
      <div ref={logInComponentRef} className="inline-block relative scale-90">
        <GameLogin setIsLogin={setIsLogin} setPlayerInfor={setPlayerInfor} />
        <canvas
          id="GameCanvas"
          className="bg-white"
          width={1140}
          height={640}
        ></canvas>
        <PlayerInfor />
      </div>
    </div>
  );
};

export default GamePage;
