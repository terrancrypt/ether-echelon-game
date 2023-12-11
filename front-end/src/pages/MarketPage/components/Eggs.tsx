import { useEffect, useState } from "react";

import {
  getMultiplePriceOfAssets,
  mintGameAsset,
} from "../../../services/contract-services/EngineServ";
import { formatUnits, parseEther } from "viem";
import { Modal, Spin, message } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { shortenAddr } from "../../../utils/addrUtils";
import {
  approveEEGToken,
  balanceEEGOf,
} from "../../../services/contract-services/EEGTokenServ";
import { useAccount } from "wagmi";
import { waitForTransaction } from "wagmi/actions";
import dataContract from "../../../services/contract-services/dataContract";
import { ENGINE_CONTRACT } from "../../../services/contract-services/constants";
import eggsData from "../../../data/eggs";

const Eggs = () => {
  const accountList = useSelector((state: RootState) => state.accountSlice);
  const { address } = useAccount();
  const [data, setData] = useState(null);
  const [itemForBuy, setItemsForBuy] = useState<any>();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (key: any) => {
    setIsModalOpen(true);
    if (data) setItemsForBuy(data[key]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleBuyItem = async () => {
    setIsModalOpen(false);
    try {
      if (!itemForBuy) {
        message.error("Something wrong, please reload the page and try again!");
        return;
      }

      if (!selectedAccount) {
        message.error("Please select your account!");
        return;
      }

      const price = parseEther(itemForBuy.price);
      const eggBalance = await balanceEEGOf(address as any);

      if ((eggBalance as any) < price) {
        message.error(
          "Your EEG Token balance is not enough, get it at Faucet page."
        );
        return;
      }

      setIsTxLoading(true);

      const approve: any = await approveEEGToken({
        spender: dataContract[ENGINE_CONTRACT].address,
        value: price as any,
      });

      if (approve) {
        const waitApprove = await waitForTransaction({
          hash: approve as any,
        });

        if (waitApprove) {
          message.success("Approve success!");
          const hash = await mintGameAsset({
            account: selectedAccount,
            tokenId: itemForBuy.tokenId,
            amount: 1,
          });
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
        }
      }
    } catch (error) {
      message.error("Transaction error");
    } finally {
      setIsTxLoading(false);
    }
  };

  const fetchData = async () => {
    setData(eggsData as any);

    const arrTokenIds: any = [];
    Promise.all(
      Object.keys(eggsData).map((key) => {
        arrTokenIds.push(key);
      })
    );

    const dataArr = [];
    const dataOnChain: any = await getMultiplePriceOfAssets(arrTokenIds);
    for (let i = 0; i < dataOnChain[0].length; i++) {
      dataArr.push({
        tokenId: formatUnits(dataOnChain[0][i], 0),
        name: eggsData[formatUnits(dataOnChain[0][i], 0)].name,
        image: eggsData[formatUnits(dataOnChain[0][i], 0)].image,
        price: formatUnits(dataOnChain[1][i], 18),
      });
    }

    setData(dataArr as any);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isTxLoading ? (
        <div className="mt-12 flex justify-center items-center">
          <div className="flex flex-col justify-center gap-8">
            <Spin size="large" />
            {txHash ? (
              <div>
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
        <>
          <span>Eggs can hatch into beasts corresponding to that egg.</span>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {data &&
              Object.keys(data).map((key) => {
                const object: any = data[key];
                return (
                  <div key={key} className="space-y-3 border p-2 ">
                    <div className="flex items-center text-sm gap-2">
                      <img
                        className="w-[50px] h-[50px]"
                        src={object.image}
                        alt=""
                      />
                      <span>{object.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="pl-2">Price: {object.price} EEG</span>
                      <button
                        onClick={() => showModal(key)}
                        className="bg-white text-black px-2 hover:scale-105 transition-all"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
          <Modal
            title={`Buy Eggs`}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <div className="flex flex-col gap-4 py-2">
              <span>What account you want to use?</span>
              <select
                name="Account"
                value={selectedAccount}
                onChange={handleSelectChange}
                className="border text-[13px] p-2 cursor-pointer tracking-tighter"
              >
                <option>Select an account</option>
                {accountList?.map((item) => (
                  <option key={item.tokenId} value={item.accountAddr}>
                    Account: {item.tokenId} ({item.accountAddr})
                  </option>
                ))}
              </select>

              <button
                onClick={handleBuyItem}
                className="bg-black text-white py-2"
              >
                Buy
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Eggs;
