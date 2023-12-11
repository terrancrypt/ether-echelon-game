import { readContract, writeContract } from "wagmi/actions";
import dataContract from "./dataContract";
import { ACCOUNT_NFT_CONTRACT } from "./constants";

const address = dataContract[ACCOUNT_NFT_CONTRACT].address as any;
const abi = dataContract[ACCOUNT_NFT_CONTRACT].abi;

// Read
const checkOwner = async (tokenId: string) => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "ownerOf",
    args: [tokenId],
  });
  return result;
};

const getAccountAddrById = async (tokenId: string) => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "getAccountAddrById",
    args: [tokenId],
  });
  return result;
};

const getTokenUri = async (tokenId: string) => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const base64Part = String(result).split(",")[1];
  const tokenURIString = atob(base64Part);
  const tokenURI = JSON.parse(tokenURIString);

  return tokenURI;
};

const getTokenCount = async () => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "getCurrentTokenCount",
    args: [],
  });
  return result;
};

// Write
const mintAccountNft = async (
  owner: string,
  username: string,
  ipfsImageHash: string
): Promise<string | null> => {
  try {
    const { hash } = await writeContract({
      address: address,
      abi: abi,
      functionName: "mintNFT",
      args: [owner, { username, ipfsImageHash }],
    });
    return hash;
  } catch (error) {
    return null;
  }
};

export {
  mintAccountNft,
  checkOwner,
  getTokenUri,
  getTokenCount,
  getAccountAddrById,
};
