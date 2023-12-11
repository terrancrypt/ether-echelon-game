import { readContract, writeContract } from "wagmi/actions";
import { EEG_CONTRACT } from "./constants";
import dataContract from "./dataContract";

const address = dataContract[EEG_CONTRACT].address as any;
const abi = dataContract[EEG_CONTRACT].abi;

// Read
const balanceEEGOf = async (account: string) => {
  try {
    const result = await readContract({
      address,
      abi,
      functionName: "balanceOf",
      args: [account],
    });
    return result;
  } catch (error) {
    return null;
  }
};

// Write
const getFaucetToken = async () => {
  try {
    const { hash } = await writeContract({
      address: address,
      abi: abi,
      functionName: "faucet",
      args: [],
    });
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const approveEEGToken = async ({
  spender,
  value,
}: {
  spender: string;
  value: number;
}) => {
  try {
    const { hash } = await writeContract({
      address: address,
      abi: abi,
      functionName: "approve",
      args: [spender, value],
    });
    return hash;
  } catch (error) {
    return null;
  }
};

export { getFaucetToken, approveEEGToken, balanceEEGOf };
