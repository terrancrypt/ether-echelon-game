import React, { useEffect, useRef } from "react";
import { getAccount } from "wagmi/actions";
import GameLogin from "./components/GameLogin";

const GamePlayPage = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { address } = getAccount();

  const onLogin = async (tokenId: string) => {};

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [componentRef]);

  return (
    <div className="flex items-center justify-center">
      <div ref={componentRef} className="inline-block relative scale-90">
        <GameLogin />
        <canvas className="bg-white" width={1140} height={640}></canvas>
      </div>
    </div>
  );
};

export default GamePlayPage;
