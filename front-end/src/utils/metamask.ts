import { accountNftContract } from "../services/contract-services/AccountNftServ";

interface WindowChain extends Window {
  ethereum?: any;
}

const addTokenToWallet = async (tokenId: string): Promise<boolean> => {
  try {
    const wasAdded = await (window as WindowChain).ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC721",
        options: {
          address: accountNftContract,
          tokenId: tokenId,
        },
      },
    });

    if (wasAdded) return true;
    return false;
  } catch (error) {
    return false;
  }
};

export { addTokenToWallet };
