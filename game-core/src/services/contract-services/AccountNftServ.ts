import { readContract } from "@wagmi/core";
import AccountNftAbi from "../ABIs/AccountNftAbi.json";

export const accountNftAddr = "0x389B03F73f29c3234486eB01b714f027281311fc";

const checkOwner = async (tokenId: string) => {
  const result = await readContract({
    address: accountNftAddr,
    abi: AccountNftAbi,
    functionName: "ownerOf",
    args: [tokenId],
  });
  return result;
};

const getTokenUri = async (tokenId: string): Promise<string> => {
  const result = await readContract({
    address: accountNftAddr,
    abi: AccountNftAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  return String(result);
};

export { checkOwner, getTokenUri };
