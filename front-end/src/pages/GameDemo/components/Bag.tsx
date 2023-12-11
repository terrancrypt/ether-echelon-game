import { Tooltip, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import stonesData from "../../../data/stones";
import { balanceGameAssetOf } from "../../../services/contract-services/GameAssetsServ";
import chestsData from "../../../data/chests";
import { formatUnits } from "viem";
import eggsData from "../../../data/eggs";
import { erc6551Erc1155Approved } from "../../../services/contract-services/ERC6551AccountServ";
import dataContract from "../../../services/contract-services/dataContract";
import {
  ENGINE_CONTRACT,
  GAME_ASSETS_NFT_CONTRACT,
} from "../../../services/contract-services/constants";
import { waitForTransaction } from "wagmi/actions";
import {
  incubateAnEgg,
  openChest,
} from "../../../services/contract-services/EngineServ";

const Bag = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const authState = useSelector((state: RootState) => state.authSlice);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataItems, setDataItems] = useState();
  const [singleItemData, setSingleItemData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchBag = async () => {
    const arrChests = await createItemArray(chestsData, "chest");
    const arrEggs = await createItemArray(eggsData, "egg");
    const arrStones = await createItemArray(stonesData, "stone");

    const allItems = [...arrChests, ...arrEggs, ...arrStones];

    setDataItems(allItems as any);
  };

  const createItemArray = async (data: any, type: string) => {
    const resultArray: any[] = [];
    await Promise.all(
      Object.keys(data).map(async (key) => {
        if (authState) {
          const result = await balanceGameAssetOf(
            (authState as any).accountAddr,
            key
          );
          if ((result as any) > 0) {
            resultArray.push({
              itemKey: key,
              amount: formatUnits(result as any, 0),
              src: data[key].image,
              name: data[key].name,
              type: type,
            });
          }
        }
      })
    );
    return resultArray;
  };

  const handleOpenChest = async (itemData: any) => {
    try {
      messageApi.open({
        type: "loading",
        content: "Transaction in progress...",
        duration: 0,
      });
      const approve = await erc6551Erc1155Approved({
        accountAddr: (authState as any).accountAddr,
        tokenAddr: dataContract[GAME_ASSETS_NFT_CONTRACT].address,
        operator: dataContract[ENGINE_CONTRACT].address,
      });
      if (approve) {
        const waitApprove = await waitForTransaction({
          hash: approve,
        });

        if (waitApprove) {
          message.success("Approve success!");
          const hash = await openChest({
            accountAddr: (authState as any).accountAddr,
            chestId: formatUnits(itemData.itemKey, 0),
          });

          if (hash) {
            const waitTx = await waitForTransaction({
              hash,
            });

            if (waitTx) {
              message
                .success(
                  "Open chest success! Check your bags and your beasts in a few minutes!"
                )
                .then(() => messageApi.destroy());
            }
          }
        }
      }
    } catch (error) {
      message.error("Transaction error!");
      messageApi.destroy();
    }
  };

  const handleIncubateEgg = async (itemData: any) => {
    try {
      messageApi.open({
        type: "loading",
        content: "Transaction in progress...",
        duration: 0,
      });
      const approve = await erc6551Erc1155Approved({
        accountAddr: (authState as any).accountAddr,
        tokenAddr: dataContract[GAME_ASSETS_NFT_CONTRACT].address,
        operator: dataContract[ENGINE_CONTRACT].address,
      });
      if (approve) {
        const waitApprove = await waitForTransaction({
          hash: approve,
        });

        if (waitApprove) {
          message.success("Approve success!");
          const hash = await incubateAnEgg(
            (authState as any).accountAddr,
            formatUnits(itemData.itemKey, 0)
          );

          if (hash) {
            const waitTx = await waitForTransaction({
              hash,
            });

            if (waitTx) {
              fetchBag();
              message
                .success(
                  "Incubate egg success! Check in the egg incubation section!"
                )
                .then(() => messageApi.destroy());
            }
          }
        }
      }
    } catch (error) {
      message.error("Transaction error!");
      messageApi.destroy();
    }
  };

  const handleOnItemClick = (data: any) => {
    setSingleItemData(data);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSingleItemData(null);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    fetchBag();

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalVisible, authState, messageApi]);

  return (
    <>
      {contextHolder}
      <div className="absolute top-1 left-1">
        <Tooltip placement="right" title="Bag">
          <div
            onClick={handleOpenModal}
            className="hover:scale-105 cursor-pointer bg-white rounded-full"
          >
            <img
              src="images/gui/Backpack.png"
              className="w-[20px] h-[20px] "
              alt=""
            />
          </div>
        </Tooltip>

        {isModalVisible && (
          <div className="absolute top-0 left-0 text-black px-8 py-2">
            <div
              ref={modalRef}
              className="bg-white p-2 whitespace-nowrap w-[250px] border-black border"
            >
              <p className="text-[6px] mb-2">Your bag</p>
              <div className="flex items-start justify-start">
                <div className="grid grid-cols-6 gap-1 w-[125px]">
                  {(dataItems as any).map((item: any, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleOnItemClick(item)}
                      className="bg-gray-400 w-[20px] h-[20px] cursor-pointer hover:scale-95 transition-all flex items-center justify-center relative"
                    >
                      <img src={item.src} alt="" />
                      <span className="w-[5px] h-[5px] absolute -right-[1px] -top-[1px] bg-red-600 text-white text-[3px] rounded-full flex items-center justify-center">
                        <span>{item.amount}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {singleItemData && (
                  <div className="flex-1 w-[80px] flex items-start border p-1">
                    <div className="flex flex-col items-start justify-between h-full gap-1 w-full">
                      <div className="flex justify-center items-center gap-1 ">
                        <img
                          className="w-[16px] h-[16px]"
                          src={(singleItemData as any).src}
                          alt=""
                        />
                        <p className="text-[4px]">
                          {(singleItemData as any).name}
                        </p>
                      </div>
                      {(singleItemData as any).type === "chest" && (
                        <button
                          onClick={() => handleOpenChest(singleItemData as any)}
                          className="text-[3px] bg-black text-white px-1 py-1 hover:scale-95 transition-all"
                        >
                          Open Chest
                        </button>
                      )}
                      {(singleItemData as any).type === "egg" && (
                        <>
                          <p className="text-[3px]">
                            Incubate Time:{" "}
                            {eggsData[(singleItemData as any).itemKey]
                              .incubateTime / 60}{" "}
                            minutes
                          </p>
                          <button
                            onClick={() =>
                              handleIncubateEgg(singleItemData as any)
                            }
                            className="text-[3px] bg-black text-white px-1 py-1 hover:scale-95 transition-all"
                          >
                            Incubate Egg
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bag;
