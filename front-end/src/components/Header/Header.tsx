import { useState, useEffect } from "react";
import Image from "next/image";
import EELogo from "public/EELogo.png";
import Link from "next/link";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import shortenAddress from "@/utils/shortenAddress";
import { Modal } from "antd";
import { rubik } from "@/styles/font";

const Header = () => {
  const [isClient, setIsClient] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Antd Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isClient ? (
        <header
          className={
            "container flex items-center justify-between border-b " +
            rubik.className
          }
        >
          <Link className="flex items-center justify-center py-6" href={"/"}>
            <Image src={EELogo} height={80} width={80} alt="" />
            <span className="font-bold text-xl">EtherEchelon</span>
          </Link>
          <nav className="flex items-center justify-between gap-8 font-bold text-base uppercase">
            <Link href="/">market</Link>

            <Link href="/">market</Link>

            <Link href="/">market</Link>

            <Link href="/">market</Link>
          </nav>
          <>
            {isDisconnected ? (
              <button
                className="button-connect font-bold text-base uppercase border isolate px-[40px] py-3 relative hover:text-black"
                onClick={() => open()}
              >
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button
                className="button-connect font-bold text-base uppercase border isolate px-[40px] py-3 relative hover:text-black"
                onClick={showModal}
              >
                <span>{shortenAddress(address)}</span>
              </button>
            )}
          </>
          <Modal
            title={`Address: ` + shortenAddress(address)}
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

                <Link
                  href="/create-account"
                  className="font-bold text-sm uppercase border isolate px-[30px] py-3 mt-4 hover:bg-black hover:text-white hover:scale-95 transition-all"
                  onClick={() => handleCancel()}
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </Modal>
        </header>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
