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
    address: "0xb72a747DD945Bb0f5782f3B0E9c4D8b7F40D8ab6",
    abi: EngineABI,
  },
  accountNftContract: {
    address: "0x4b9E2d190F88AfAE62558626d8Db036A179221Da",
    abi: AccountNftABI,
  },
  erc6551Registry: {
    address: "0x477Ce8BFD19BAd8e75c720938cBE9adbC6F5Ff96",
    abi: Erc6551RegistryABI,
  },
  erc6551Account: {
    address: "",
    abi: Erc6551AccountAbi,
  },
  GameAssetsNFT: {
    address: "0x0Eb6AC5ccA703239A764713104D24C97e843da23",
    abi: GameAssetsNFT,
  },
  EEGToken: {
    address: "0x536E1C450CBC7008d58d8E80f7e18eeb082D47bA",
    abi: EEGAbi,
  },
};
export default dataContract;
