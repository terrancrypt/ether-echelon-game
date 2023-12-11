import { readContract } from "wagmi/actions";
import { GAME_ASSETS_NFT_CONTRACT } from "./constants";
import dataContract from "./dataContract";

const address = dataContract[GAME_ASSETS_NFT_CONTRACT].address as any;
const abi = dataContract[GAME_ASSETS_NFT_CONTRACT].abi;

// Read
const balanceGameAssetOf = async (account: string, tokenId: string) => {
  try {
    const result = await readContract({
      address,
      abi,
      functionName: "balanceOf",
      args: [account, tokenId],
    });
    return result;
  } catch (error) {
    return null;
  }
};

export { balanceGameAssetOf };
