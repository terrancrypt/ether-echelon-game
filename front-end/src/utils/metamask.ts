import {
  ACCOUNT_NFT_CONTRACT,
  EEG_CONTRACT,
} from "../services/contract-services/constants";
import dataContract from "../services/contract-services/dataContract";

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
          address: dataContract[ACCOUNT_NFT_CONTRACT].address,
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

const addEEGTokenToWallet = async () => {
  try {
    // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
    const wasAdded = await (window as WindowChain).ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: dataContract[EEG_CONTRACT].address,
          symbol: "EEG",
          decimals: 18,
          image: "/EtherEchelon_Logo.png",
        },
      },
    });

    if (wasAdded) return true;
    return false;
  } catch (error) {
    return false;
  }
};

export { addTokenToWallet, addEEGTokenToWallet };
