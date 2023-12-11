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
    address: "0x63Dcb9d8a5220582555fFb7757e08882eFc27e1B",
    abi: EngineABI,
  },
  accountNftContract: {
    address: "0x295DA2862970756eaA977639C130ACE30ba23BC2",
    abi: AccountNftABI,
  },
  erc6551Registry: {
    address: "0x259739DC2f1cAf31e23c11E8f3137563BeA38686",
    abi: Erc6551RegistryABI,
  },
  erc6551Account: {
    address: "",
    abi: Erc6551AccountAbi,
  },
  GameAssetsNFT: {
    address: "0x4AeB35952971271F4358E791451F2095E197a010",
    abi: GameAssetsNFT,
  },
  EEGToken: {
    address: "0xcdcfb95C577D8c1a94cEa08030c8F91E35407F5E",
    abi: EEGAbi,
  },
};
export default dataContract;
