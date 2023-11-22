import { watchContractEvent, writeContract } from "wagmi/actions";
import AccountNftAbi from "../ABIs/AccountNftAbi.json";

export const accountNftContract = "0x389B03F73f29c3234486eB01b714f027281311fc";

// Read

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

export { mintAccountNft };
