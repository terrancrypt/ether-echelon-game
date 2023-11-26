import { useEffect, useRef } from "react";
import GameLogin from "./components/GameLogin";
import { draw, startAnimation, stopAnimation } from "./game-logic/draw";
import { Sprites } from "./game-logic/class/Sprites";
import { charactersData } from "../../data/charaters";
import { Person } from "./game-logic/class/Person";
import { Boundary } from "./game-logic/class/Boundary";

const GamePage = () => {
  const logInComponentRef = useRef<HTMLDivElement>(null);

  // Move to canvas
  useEffect(() => {
    if (logInComponentRef.current) {
      logInComponentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logInComponentRef]);

  // Start draw canvas & game logic
  useEffect(() => {
    //   const loginBackground = new Sprites(
    //     0,
    //     -100,
    //     "images/windrise-background.png"
    //   );
    //   startAnimation(loginBackground, "loginBackground", true, false);

    const component = document.querySelector<HTMLDivElement>(
      "#GameLoginComponent"
    );
    if (component) component.style.display = "none";

    const canvas: HTMLCanvasElement | null =
      document.querySelector("#GameCanvas");

    if (canvas) {
      const overworld = new Sprites(-400, -700, "images/Overworld.png");
      const dataCharacter = charactersData["AdventureGirl"];
      const boundary = new Boundary(200, 200);

      const movables = [overworld, boundary];

      const player = new Person(
        canvas.width / 2 - 192 / 4 / 2,
        canvas.height / 2 - 68 / 2,
        dataCharacter.sprites.down,
        {
          up: dataCharacter.sprites.up,
          down: dataCharacter.sprites.down,
          left: dataCharacter.sprites.left,
          right: dataCharacter.sprites.right,
        },
        movables
      );

      startAnimation(overworld, "overworld", false, false);
      startAnimation(boundary, "boundary", false, false);
      startAnimation(player, "player", false, true);
    }

    // Stop all animation if component unmounted
    return () => {
      stopAnimation("loginBackground");
      stopAnimation("player");
      stopAnimation("overworld");
    };
  }, []);

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

export default GamePage;
