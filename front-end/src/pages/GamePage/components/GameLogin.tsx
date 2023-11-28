import { message } from "antd";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getAccount } from "wagmi/actions";
import { startAnimation, stopAnimation } from "../game-logic/draw";
import {
  checkOwner,
  getTokenUri,
} from "../../../services/contract-services/AccountNftServ";
import { NavLink } from "react-router-dom";
import { charactersData } from "../../../data/charaters";
import { Sprites } from "../game-logic/class/Sprites";
import { PlayerInfor } from "../GamePage";
import { writeUserData } from "../../../services/firebase/firebase";

interface GameLoginProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayerInfor: React.Dispatch<React.SetStateAction<PlayerInfor>>;
}

const GameLogin: React.FC<GameLoginProps> = ({
  setIsLogin,
  setPlayerInfor,
}) => {
  const [tokenId, setTokenId] = useState("");
  const { address } = getAccount();

  const handleTokenIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenId(event.target.value);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tokenId === "") {
      message.error("TokenId invalid!");
      return;
    }

    try {
      const owner = await checkOwner(tokenId);
      if (owner != address) {
        message.error("You are not the owner of this account!");
        return;
      }

      const tokenURI = await getTokenUri(tokenId);
      const splitUrl = tokenURI.image.split("/");
      const imgHash = splitUrl.pop();

      console.log(tokenURI);

      const characterKey =
        Object.keys(charactersData).find(
          (key) => charactersData[key].ipfsHash === imgHash
        ) || null;

      const loginInfor = {
        owner: owner,
        tokenId: tokenId,
        character: characterKey,
        accountAddr: "",
      };

      if (characterKey)
        setPlayerInfor({
          tokenId,
          characterKey,
        });

      window.localStorage.setItem("loginInfor", JSON.stringify(loginInfor));

      writeUserData({
        accountInfor: {
          tokenId: Number(tokenId),
          username: tokenURI.userName,
          accountAddr: "",
          ownerAddr: "",
        },
        gameInfor: {
          direction: "down",
          position: {
            x: 100,
            y: 300,
          },
        },
      });

      message.success("Login Success");

      const component = document.querySelector<HTMLDivElement>(
        "#GameLoginComponent"
      );
      if (component) component.style.display = "none";

      stopAnimation("loginBackground");

      setIsLogin(true);
    } catch (error) {
      console.log(error);
      message.error("Login error!");
    }
  };

  // Start background animation
  useEffect(() => {
    const loginBackground = new Sprites(
      0,
      -100,
      "images/windrise-background.png"
    );
    startAnimation(loginBackground, "loginBackground", true);
  }, []);

  return (
    <div
      id="GameLoginComponent"
      className="absolute top-[20%] left-[10%] text-black bg-white bg-opacity-90 border-2 border-black z-10"
    >
      <div className="p-6">
        <h2 className="font-semibold text-xl">Welcome to Ether Echelon</h2>
        <span>Please login to play the game</span>
        <div>
          <form
            className="flex flex-col gap-2 mt-6"
            onSubmit={handleLoginSubmit}
          >
            <span>Your TokenId</span>
            <input
              className="border border-black"
              type="text"
              name="tokenId"
              value={tokenId}
              onChange={handleTokenIdChange}
            />
            <button type="submit" className="bg-orange-500 text-white rounded">
              Login
            </button>
          </form>
          <div className="mt-4 pt-2 border-t">
            <p>
              If you dont have an account, create one on the{" "}
              <NavLink to="/create-account" className="underline">
                create account page
              </NavLink>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLogin;
