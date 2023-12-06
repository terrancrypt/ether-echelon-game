import { useEffect, useRef } from "react";
import { auth, initFireBase } from "../../services/firebase/firebase";
import Overworld from "./classes/Overworld";
import { useAccount, useConnect } from "wagmi";
import LoginGame from "./components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { DatabaseReference, onDisconnect, ref } from "firebase/database";

const PlayPage = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useAccount();

  // Move to canvas
  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [componentRef]);

  useEffect(() => {}, []);
  return (
    <>
      {isConnected ? (
        <div
          ref={componentRef}
          className="flex items-center justify-center h-screen"
        >
          <div className="play-container scale-[3] relative outline">
            <LoginGame />
            <canvas className="play-canvas" width={352} height={198}></canvas>
          </div>
        </div>
      ) : (
        <p className="text-center pt-20">
          You need to connect your wallet to play the game.
        </p>
      )}{" "}
    </>
  );
};

export default PlayPage;
