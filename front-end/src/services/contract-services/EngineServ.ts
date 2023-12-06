import { writeContract } from "wagmi/actions";
import dataContract from "./dataContract";
import { ENGINE_CONTRACT } from "./constants";

const address = dataContract[ENGINE_CONTRACT].address as any;
const abi = dataContract[ENGINE_CONTRACT].abi;

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

export { createAccountNftWithAddress };
