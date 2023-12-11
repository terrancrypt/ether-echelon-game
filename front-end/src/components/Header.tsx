import { useEffect, useState } from "react";
import EELogo from "/EtherEchelon_Logo.png";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Modal, message } from "antd";
import { NavLink } from "react-router-dom";
import { shortenAddr } from "../utils/addrUtils";
import {
  checkOwner,
  getAccountAddrById,
  getTokenCount,
} from "../services/contract-services/AccountNftServ";
import { formatUnits } from "viem";
import { useDispatch } from "react-redux";
import { addAccount } from "../redux/accountSlice";
import { setLoading } from "../redux/loadingSlice";

const Header = () => {
  const { open } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();
  const [isHovered, setIsHovered] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAccount = async () => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      const result = await getTokenCount();
      const tokenCount = formatUnits(result as any, 0);

      const accList = [];
      for (let i = 0; i < Number(tokenCount); i++) {
        const owner = await checkOwner(String(i));

        if (address == (owner as any)) {
          const accountAddr = await getAccountAddrById(String(i));
          if (accountAddr) {
            accList.push({
              tokenId: String(i),
              accountAddr: accountAddr,
            });
          }
        }
      }

      if (accList.length > 0) {
        dispatch(addAccount(accList as any));
      }

      setAccountList(accList as any);
    } catch (error) {
      message.error("Fetch your account list error!");
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [address]);

  return (
    <>
      <header
        className={
          "container flex items-center justify-between border-b tracking-tighter"
        }
      >
        <NavLink className="flex items-center justify-center py-2" to={"/"}>
          <img src={EELogo} height={80} width={80} alt="" />
        </NavLink>
        <nav className="flex items-center justify-between gap-8 font-bold uppercase relative text-[10px]">
          <NavLink className="hover:underline" to="/play">
            play
          </NavLink>
          <NavLink className="hover:underline" to="/how-to-play">
            how-to-play
          </NavLink>
          <NavLink className="hover:underline" to="/create-account">
            create-account
          </NavLink>
          <NavLink className="hover:underline" to="/market">
            MARKET
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p className="hover:underline cursor-pointer">game-information</p>
            {isHovered && (
              <div className="absolute right-0 top-4 bg-black border p-4 space-y-4 flex flex-col z-50">
                <NavLink to="/beasts" className="hover:underline">
                  Ether Beasts
                </NavLink>
                <NavLink to="/skills" className="hover:underline">
                  Skills
                </NavLink>
              </div>
            )}
          </div>
          <NavLink className="hover:underline" to="/faucet">
            Faucet
          </NavLink>
          <a
            className="hover:underline"
            href="https://github.com/terrancrypt/constellation-hackathon?tab=readme-ov-file#ether-echelon-documentation"
            target="_blank"
          >
            DOCS
          </a>
        </nav>
        <>
          {isDisconnected ? (
            <button
              className="button-connect font-bold text-[10px] uppercase border isolate px-[40px] py-3 relative hover:text-black"
              onClick={() => open()}
            >
              <span>Connect Wallet</span>
            </button>
          ) : (
            <button
              className="button-connect font-bold text-[10px] uppercase border isolate px-[40px] py-3 relative hover:text-black"
              onClick={showModal}
            >
              <span>{shortenAddr(address)}</span>
            </button>
          )}
        </>
        <Modal
          title={`Address: ` + shortenAddr(address)}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          className="tracking-tighter"
        >
          <p
            className="mb-3 uppercase font-bold border inline-block px-4 py-2 bg-black text-white hover:bg-white hover:text-black hover:scale-95 transition-all cursor-pointer"
            onClick={() => open().then(handleCancel)}
          >
            Wallet setting
          </p>
          <div className="flex flex-col items-start border-t">
            <span className="mt-3 font-bold text-[14px]">Your Account</span>
            {isLoading ? (
              <p className="py-2">Loading...</p>
            ) : (
              <>
                {" "}
                {accountList.length === 0 ? (
                  <p>You don't have any account</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 mt-3 whitespace-nowrap">
                    {accountList.map((item: any, index) => (
                      <div
                        className="p-3 text-center border cursor-pointer"
                        key={index}
                      >
                        <p>Token ID: {item.tokenId}</p>
                        <a
                          href={`https://mumbai.polygonscan.com/address/${item.accountAddr}`}
                          target="_blank"
                        >
                          {shortenAddr(item.accountAddr)}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between gap-2">
              {/* <button className="font-bold text-sm uppercase border isolate px-[30px] py-3 mt-4 bg-black text-white hover:bg-white hover:text-black hover:scale-95 transition-all">
                Your Profile
              </button> */}

              <NavLink
                to="/create-account"
                className="font-bold text-[10px] uppercase border isolate px-[30px] py-3 mt-4 bg-black text-white hover:bg-white hover:text-black hover:scale-95 transition-all"
                onClick={() => handleCancel()}
              >
                Create New Account
              </NavLink>
            </div>
          </div>
        </Modal>
      </header>
    </>
  );
};

export default Header;
