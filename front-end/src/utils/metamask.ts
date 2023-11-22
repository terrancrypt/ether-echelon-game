import { accountNftContract } from "@/services/contract-services/AccountNftServ";

const addTokenToWallet = async (tokenId: string): Promise<boolean> => {
  try {
    const wasAdded = await (window.ethereum as any).request({
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
