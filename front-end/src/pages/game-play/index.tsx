import React, { useEffect, useRef } from "react";
import { getAccount } from "wagmi/actions";
import GameLogin from "./components/GameLogin";
import { draw } from "./game-logic/draw";

const GamePlayPage = () => {
  const logInComponentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { address } = getAccount();

  useEffect(() => {
    if (logInComponentRef.current) {
      logInComponentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logInComponentRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    let animationFrameId: number;
    if (context) {
      animationFrameId = requestAnimationFrame(() => draw(context));
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasRef, draw]);

  return (
    <div className="flex items-center justify-center">
      <div ref={logInComponentRef} className="inline-block relative scale-90">
        <GameLogin />
        <canvas
          ref={canvasRef}
          className="bg-white"
          width={1140}
          height={640}
        ></canvas>
      </div>
    </div>
  );
};

export default GamePlayPage;
