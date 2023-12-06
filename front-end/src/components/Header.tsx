import { useState } from "react";
import EELogo from "/EtherEchelon_Logo.png";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Modal } from "antd";
import { NavLink } from "react-router-dom";
import { shortenAddr } from "../utils/addrUtils";

const Header = () => {
  const { open } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();
  const [isHovered, setIsHovered] = useState(false);

  // Antd Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        <nav className="flex items-center justify-between gap-8 font-bold text-xs uppercase relative">
          <NavLink className="hover:underline" to="/play">
            play
          </NavLink>
          <NavLink className="hover:underline" to="/create-account">
            create-account
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <p className="hover:underline cursor-pointer">game-information</p>
            {isHovered && (
              <div className="absolute right-0 top-4 bg-black border p-4 space-y-4 flex flex-col">
                <NavLink to="/beasts" className="hover:underline">
                  Ether Beasts
                </NavLink>
                <NavLink to="/skills" className="hover:underline">
                  Skills
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        <>
          {isDisconnected ? (
            <button
              className="button-connect font-bold text-xs uppercase border isolate px-[40px] py-3 relative hover:text-black"
              onClick={() => open()}
            >
              <span>Connect Wallet</span>
            </button>
          ) : (
            <button
              className="button-connect font-bold text-xs uppercase border isolate px-[40px] py-3 relative hover:text-black"
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
        >
          <p
            className="mb-3 uppercase font-bold border inline-block px-4 py-2 bg-black text-white hover:bg-white hover:text-black hover:scale-95 transition-all cursor-pointer"
            onClick={() => open().then(handleCancel)}
          >
            Address setting
          </p>
          <div className="flex flex-col items-start border-t">
            <span className="mt-3 font-bold text-xl ">Account</span>
            <p>You don't have any account</p>
            <div className="flex items-center justify-between gap-2">
              <button className="font-bold text-sm uppercase border isolate px-[30px] py-3 mt-4 bg-black text-white hover:bg-white hover:text-black hover:scale-95 transition-all">
                Your Profile
              </button>

              <NavLink
                to="/create-account"
                className="font-bold text-sm uppercase border isolate px-[30px] py-3 mt-4 hover:bg-black hover:text-white hover:scale-95 transition-all"
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
