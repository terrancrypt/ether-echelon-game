import { writeContract } from "wagmi/actions";
import { ERC6551_ACCOUNT } from "./constants";
import dataContract from "./dataContract";

const abi = dataContract[ERC6551_ACCOUNT].abi;

const erc6551Erc1155Approved = async ({
  accountAddr,
  tokenAddr,
  operator,
}: {
  accountAddr: string;
  tokenAddr: string;
  operator: string;
}) => {
  try {
    const { hash } = await writeContract({
      address: accountAddr as any,
      abi,
      functionName: "safeApproveERC1155",
      args: [tokenAddr, operator, true],
    });
    return hash;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { erc6551Erc1155Approved };
