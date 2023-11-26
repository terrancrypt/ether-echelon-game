import { readContract, watchContractEvent, writeContract } from "wagmi/actions";
import AccountNftAbi from "../ABIs/AccountNftAbi.json";

export const accountNftContract = "0x389B03F73f29c3234486eB01b714f027281311fc";

// Read
const checkOwner = async (tokenId: string) => {
  const result = await readContract({
    address: accountNftContract,
    abi: AccountNftAbi,
    functionName: "ownerOf",
    args: [tokenId],
  });
  return result;
};

const getTokenUri = async (tokenId: string) => {
  const result = await readContract({
    address: accountNftContract,
    abi: AccountNftAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const base64Part = String(result).split(",")[1];
  const tokenURIString = atob(base64Part);
  const tokenURI = JSON.parse(tokenURIString);

  return tokenURI;
};

// Write
const mintAccountNft = async (
  owner: string,
  username: string,
  ipfsImageHash: string
): Promise<string | null> => {
  try {
    const { hash } = await writeContract({
      address: accountNftContract,
      abi: AccountNftAbi,
      functionName: "mintNFT",
      args: [owner, { username, ipfsImageHash }],
    });
    return hash;
  } catch (error) {
    console.log();
    return null;
  }
};

export { mintAccountNft, checkOwner, getTokenUri };
