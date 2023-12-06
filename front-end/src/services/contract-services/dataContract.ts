import EngineABI from "../ABIs/EngineAbi.json";
import AccountNftABI from "../ABIs/AccountNftAbi.json";
import Erc6551RegistryABI from "../ABIs/Erc6551RegistryAbi.json";

interface DataContract {
  [key: string]: {
    address: string;
    abi: any;
  };
}

const dataContract: DataContract = {
  engineContract: {
    address: "0x6D6083B7C98b04888a8D2B8523fEEfD430Ae5626",
    abi: EngineABI,
  },
  accountNftContract: {
    address: "0xE892eE55ccc5E7dD22298A649f50853b0BE8B44E",
    abi: AccountNftABI,
  },
  erc6551Registry: {
    address: "0xdbc4b465A22a96afCFaE0c9EB6Cd5604465192e1",
    abi: Erc6551RegistryABI,
  },
};
export default dataContract;
