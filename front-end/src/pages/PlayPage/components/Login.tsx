import { message } from "antd";
import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  checkOwner,
  getTokenCount,
  getTokenUri,
} from "../../../services/contract-services/AccountNftServ";
import { useAccount } from "wagmi";
import {
  initFireBase,
  realtimeDatabase,
  writeUserData,
} from "../../../services/firebase/firebase";
import { charactersData } from "../../../data/charaters";
import Overworld from "../classes/Overworld";
import { getRandomSafeSpot, withGrid } from "../utils/utils";

const LoginGame = () => {
  const [tokenId, setTokenId] = useState("");
  const { address } = useAccount();

  const handleTokenIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTokenId(event.target.value);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tokenId === "") message.error("Please enter your token id");

    const tokenCount = await getTokenCount();
    if (Number(tokenId) >= parseInt(String(tokenCount), 0)) {
      message.error("Token ID invalid!");
      return;
    }

    const ownerAddr = await checkOwner(tokenId);
    if (String(ownerAddr) != address) {
      message.error(`You are not the owner of token id: ${tokenId}`);
      return;
    }

    const tokenUri = await getTokenUri(tokenId);
    const splitUrl = tokenUri.image.split("/");
    const imgHash = splitUrl.pop();

    const character =
      Object.keys(charactersData).find(
        (key) => charactersData[key].ipfsHash === imgHash
      ) || null;

    await initFireBase();

    const { x, y } = getRandomSafeSpot();

    writeUserData({
      accountInfor: {
        tokenId: Number(tokenId),
        username: tokenUri.userName,
        accountAddr: tokenUri.accountAddr,
        ownerAddr: address,
      },
      gameInfor: {
        character: character as string,
        direction: "down",
        position: {
          x: withGrid(x),
          y: withGrid(y),
        },
        movingProgressRemaining: 0,
      },
    });

    const overworld = new Overworld({
      element: document.querySelector(".play-container") as HTMLElement,
      database: realtimeDatabase,
    });

    overworld.init();

    const loginComponent = document.querySelector(".login-game");
    loginComponent?.classList.add("hidden");
  };

  return (
    <div className="login-game absolute top-0 right-0 left-0 bottom-0 tracking-tight">
      <div className=" text-black p-6">
        <div className="bg-white px-6">
          <span className="text-[6px]">Welcome to Ether Echelon</span>
          <p className="text-[4px]">Please login to play the game</p>
          <div>
            <form
              className="flex flex-col gap-1 mt-2"
              onSubmit={handleLoginSubmit}
            >
              <span className="text-[4px]">Your TokenId</span>
              <input
                className="border border-black text-[6px] focus-visible:outline-none px-1"
                type="text"
                name="tokenId"
                value={tokenId}
                onChange={handleTokenIdChange}
              />
              <button
                type="submit"
                className="bg-orange-500 text-white text-[6px]"
              >
                Login
              </button>
            </form>
            <div className="my-2 py-2 border-t">
              <p className="text-[4px]">
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
    </div>
  );
};

export default LoginGame;
