import EngineABI from "../ABIs/EngineAbi.json";
import AccountNftABI from "../ABIs/AccountNftAbi.json";
import Erc6551RegistryABI from "../ABIs/Erc6551RegistryAbi.json";
import GameAssetsNFT from "../ABIs/GameAssetsNftAbi.json";
import EEGAbi from "../ABIs/EEGAbi.json";
import Erc6551AccountAbi from "../ABIs/Erc6551AccountAbi.json";

interface DataContract {
  [key: string]: {
    address: string;
    abi: any;
  };
}

const dataContract: DataContract = {
  engineContract: {
    address: "0xe3A64C6ec0CB86C31158EAF01E60dAF85662084C",
    abi: EngineABI,
  },
  accountNftContract: {
    address: "0xeA06E2a7C765270387b44427DB2fD2c47561aaF7",
    abi: AccountNftABI,
  },
  erc6551Registry: {
    address: "0x1F96D347a3E1956b5Ccf504090d934c2CF9D70BC",
    abi: Erc6551RegistryABI,
  },
  erc6551Account: {
    address: "",
    abi: Erc6551AccountAbi,
  },
  GameAssetsNFT: {
    address: "0x1F501DB21f83BB60Aabaf4D8e44F148C3e53587F",
    abi: GameAssetsNFT,
  },
  EEGToken: {
    address: "0xf1Cd83753a2f4aa18462b855ffD0e42f39Ce09d8",
    abi: EEGAbi,
  },
};
export default dataContract;
