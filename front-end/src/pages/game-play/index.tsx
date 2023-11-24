import React, { ChangeEvent, useEffect, useRef } from "react";
import { getAccount } from "wagmi/actions";
import GameLogin from "./components/GameLogin";
import { Sprites } from "./game-logic/class/Sprites";
import { draw, startAnimation, stopAnimation } from "./game-logic/draw";
import { charactersData } from "@/data/characters";
import { Person } from "./game-logic/class/Person";
import { Boundary } from "./game-logic/class/Boundary";
import { collisionsData } from "@/data/collisions";

const GamePlayPage = () => {
  const logInComponentRef = useRef<HTMLDivElement>(null);
  const { address } = getAccount();

  useEffect(() => {
    if (logInComponentRef.current) {
      logInComponentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logInComponentRef]);

  useEffect(() => {
    // const loginBackground = new Sprites(
    //   0,
    //   -100,
    //   "images/windrise-background.png"
    // );
    // startAnimation(loginBackground, "loginBackground", true, false);

    // ========= Test

    const component = document.querySelector<HTMLDivElement>(
      "#GameLoginComponent"
    );
    if (component) component.style.display = "none";

    const dataCharacter = charactersData["AdventureGirl"];

    const overworld = new Sprites(0, 0, "images/Overworld.png");

    const player = new Person(
      0,
      0,
      dataCharacter.sprites.down,
      {
        up: dataCharacter.sprites.up,
        down: dataCharacter.sprites.down,
        left: dataCharacter.sprites.left,
        right: dataCharacter.sprites.right,
      },
      overworld
    );

    startAnimation(overworld, "overworld", false, false);
    startAnimation(player, "player", false, true);

    // End Test
    return () => {
      stopAnimation("loginBackground");
      stopAnimation("player");
      stopAnimation("overworld");
    };
  }, [draw]);

  return (
    <div className="flex items-center justify-center">
      <div ref={logInComponentRef} className="inline-block relative scale-90">
        <GameLogin />
        <canvas
          id="GameCanvas"
          className="bg-white"
          width={1140}
          height={640}
        ></canvas>
      </div>
    </div>
  );
};

export default GamePlayPage;
