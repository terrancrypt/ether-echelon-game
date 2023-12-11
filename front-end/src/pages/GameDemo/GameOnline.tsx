import { useEffect, useRef } from "react";
import "./gameStyle.css";
import LoginGame from "./components/LoginGame";
import Bag from "./components/Bag";
import BeastsOf from "./components/BeastsOf";
import Incubation from "./components/Incubation";

const GameOnline = () => {
  const logInComponentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logInComponentRef.current) {
      logInComponentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logInComponentRef]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        ref={logInComponentRef}
        className="game-online-container scale-[3] relative outline"
      >
        <Bag />
        <BeastsOf />
        <Incubation />
        <LoginGame />
        <canvas
          className="game-online-canvas"
          width={352}
          height={198}
        ></canvas>
      </div>
    </div>
  );
};

export default GameOnline;
