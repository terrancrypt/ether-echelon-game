import { readContract, writeContract } from "wagmi/actions";
import dataContract from "./dataContract";
import { ENGINE_CONTRACT } from "./constants";

const address = dataContract[ENGINE_CONTRACT].address as any;
const abi = dataContract[ENGINE_CONTRACT].abi;

// Read
const getMultiplePriceOfAssets = async (arrTokenIds: string[]) => {
  try {
    const result = await readContract({
      address,
      abi,
      functionName: "getMultipleGameAssetsPrices",
      args: [arrTokenIds],
    });
    return result;
  } catch (error) {
    return null;
  }
};

const getAccountIsIncubateEgg = async (account: string, tokenId: string) => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "getAccountIsIncubateEgg",
    args: [account, tokenId],
  });
  return result;
};

const getEggIncubatedStartTime = async (account: string, tokenId: string) => {
  const result = await readContract({
    address: address,
    abi: abi,
    functionName: "getEggIncubatedStartTime",
    args: [account, tokenId],
  });
  return result;
};

// Write
const evolveBeast = async (account: string, tokenId: string) => {
  const { hash } = await writeContract({
    address: address,
    abi: abi,
    functionName: "evolveBeast",
    args: [account, tokenId],
  });
  return hash;
};

const incubateAnEgg = async (account: string, tokenId: string) => {
  const { hash } = await writeContract({
    address: address,
    abi: abi,
    functionName: "incubateAnEgg",
    args: [account, tokenId],
  });
  return hash;
};

const hatchEgg = async (account: string, tokenId: string) => {
  const { hash } = await writeContract({
    address: address,
    abi: abi,
    functionName: "hatchEgg",
    args: [account, tokenId],
  });
  return hash;
};

const createAccountNftWithAddress = async (
  username: string,
  ipfsImageHash: string
) => {
  try {
    const { hash } = await writeContract({
      address: address,
      abi: abi,
      functionName: "createAccount",
      args: [{ username, ipfsImageHash }],
    });
    return hash;
  } catch (error) {
    return null;
  }
};

const mintGameAsset = async ({
  account,
  tokenId,
  amount,
}: {
  account: string;
  tokenId: number;
  amount: number;
}) => {
  try {
    const { hash } = await writeContract({
      address,
      abi,
      functionName: "mintGameAsset",
      args: [account, tokenId, amount],
    });
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const openChest = async ({
  accountAddr,
  chestId,
}: {
  accountAddr: string;
  chestId: string;
}) => {
  try {
    const { hash } = await writeContract({
      address,
      abi,
      functionName: "openChest",
      args: [accountAddr, chestId],
    });

    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/// Owner Write Functions
const addIpfsImageHashForAccountNft = async (ipfsHash: string) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "addIpfsImageHashForAccountNft",
    args: [ipfsHash],
  });
  return hash;
};

const setUpIfpsHashForGameAssets = async (ipfsHash: string) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setUpIfpsHashForGameAssets",
    args: [ipfsHash],
  });
  return hash;
};

const addMultipleTokenIdsGameAssets = async (data: any) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "addMultipleTokenIdsGameAssets",
    args: [data],
  });
  return hash;
};

const setGameAssetPrice = async (tokenId: string, priceInWei: string) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setGameAssetPrice",
    args: [tokenId, priceInWei],
  });
  return hash;
};

const setNumberItemsInChest = async () => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setNumberItemsInChest",
    args: [10],
  });
  return hash;
};

const setChestInfor = async (tokenId: number, data: any) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setChestInfor",
    args: [tokenId, data],
  });
  return hash;
};

const setBeastEvolveInfor = async (
  tokenId: number,
  evolveTo: number,
  conditionId: number
) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setBeastEvolveInfor",
    args: [tokenId, evolveTo, conditionId],
  });
  return hash;
};

const setEggIncubateInfor = async (
  tokenId: number,
  hatchTo: number,
  time: number
) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setEggIncubateInfor",
    args: [tokenId, hatchTo, time],
  });
  return hash;
};

const setStartingBeast = async (tokenId: number) => {
  const { hash } = await writeContract({
    address,
    abi,
    functionName: "setStartingBeast",
    args: [tokenId, true],
  });
  return hash;
};

export {
  createAccountNftWithAddress,
  getMultiplePriceOfAssets,
  mintGameAsset,
  openChest,
  addIpfsImageHashForAccountNft,
  setUpIfpsHashForGameAssets,
  addMultipleTokenIdsGameAssets,
  setGameAssetPrice,
  setNumberItemsInChest,
  setChestInfor,
  setBeastEvolveInfor,
  setEggIncubateInfor,
  setStartingBeast,
  evolveBeast,
  incubateAnEgg,
  hatchEgg,
  getAccountIsIncubateEgg,
  getEggIncubatedStartTime,
};
