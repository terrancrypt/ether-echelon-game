import { charactersData } from "./../../front-end/src/pages/create-account/data/characters";
import { readContract } from "@wagmi/core";
import {
  checkOwner,
  getTokenUri,
} from "./services/contract-services/AccountNftServ";
import { address } from "./services/web3Modal";

const tokenIdElement = document.querySelector<HTMLInputElement>("#tokenId");
const loginBtn = document.querySelector("#loginButton") as HTMLButtonElement;

loginBtn?.addEventListener("click", async () => {
  const tokenId = tokenIdElement?.value;

  if (tokenId) {
    const isOwner = await checkOwner(tokenId);
    if (isOwner == address) {
      const tokenUriBase64: string = await getTokenUri(tokenId);
      const base64Part = tokenUriBase64.split(",")[1];
      const tokenUriString = atob(base64Part);
      const tokenUri = JSON.parse(tokenUriString);
      console.log(tokenUri);
      // const loginInfor = {
      //   isLogin: true,
      //   address: isOwner,
      //   userCharacter: () => {

      //     charactersData:
      //   }
      // }
    }
  }
});
