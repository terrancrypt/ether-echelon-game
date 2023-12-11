import { Spin, message } from "antd";
import { useAccount } from "wagmi";
import { getFaucetToken } from "../../services/contract-services/EEGTokenServ";
import { useState } from "react";
import { waitForTransaction } from "wagmi/actions";
import { shortenAddr } from "../../utils/addrUtils";
import { addEEGTokenToWallet } from "../../utils/metamask";

const FaucetPage = () => {
  const [txHash, setTxHash] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnected } = useAccount();

  const handleOnClick = async () => {
    try {
      setIsLoading(true);
      const hash = await getFaucetToken();
      if (hash) {
        setTxHash(hash);
        const wait = await waitForTransaction({
          hash: hash as any,
        });
        if (wait) {
          message.success("Transaction success!");
        }
      } else {
        message.error("Transaction error!");
      }
    } catch (error) {
      message.error("Transaction error!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isConnected ? (
        <>
          {isLoading ? (
            <div className="mt-12 flex justify-center items-center">
              <div className="flex flex-col justify-center gap-8">
                <Spin size="large" />
                {txHash ? (
                  <div className="text-[12px]">
                    <p className="mb-2">Your transaction in progress...</p>
                    <p>
                      Hash:{" "}
                      <a
                        className="underline cursor-pointer hover:text-blue-700"
                        href={`https://mumbai.polygonscan.com/tx/` + txHash}
                        target="_blank"
                      >
                        {shortenAddr(txHash)}
                      </a>
                    </p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <div className="container tracking-tighter">
              <div className="my-8 space-y-4">
                <h2 className="text-[18px] text-center">Faucet</h2>
              </div>
              <div className="flex items-start justify-center gap-20">
                <div className="flex flex-col items-start gap-4 text-left">
                  <h3 className="text-[14px]">Mumbai Faucet</h3>
                  <a
                    className="underline text-[12px]"
                    href="https://mumbaifaucet.com/"
                    target="_blank"
                  >
                    https://mumbaifaucet.com/
                  </a>
                  <a
                    className="underline text-[12px]"
                    href="https://faucet.polygon.technology/"
                    target="_blank"
                  >
                    https://faucet.polygon.technology/
                  </a>
                </div>
                <div>
                  <h3 className="text-[14px] mb-4">
                    Ether Echelon Game Token (EEG)
                  </h3>
                  <div className="pb-4">
                    <button
                      onClick={() => {
                        handleOnClick();
                      }}
                      className="text-[12px] bg-white text-black px-2 py-3 mr-4 hover:scale-95 transition-all"
                    >
                      Get Token{" "}
                    </button>
                    <span className="text-[10px]">100 EEG Receive</span>
                  </div>
                  <button
                    onClick={() => {
                      addEEGTokenToWallet();
                    }}
                    className="text-[9px] bg-white text-black px-1 py-2 mr-4 hover:scale-95 transition-all"
                  >
                    Add To Wallet{" "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center pt-10">Please connect your wallet</p>
      )}
    </>
  );
};

export default FaucetPage;
