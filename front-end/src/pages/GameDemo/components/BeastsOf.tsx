import { Tooltip, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { balanceGameAssetOf } from "../../../services/contract-services/GameAssetsServ";
import { formatUnits } from "viem";
import { beastsData } from "../../../data/beasts";
import { erc6551Erc1155Approved } from "../../../services/contract-services/ERC6551AccountServ";
import dataContract from "../../../services/contract-services/dataContract";
import {
  ENGINE_CONTRACT,
  GAME_ASSETS_NFT_CONTRACT,
} from "../../../services/contract-services/constants";
import { waitForTransaction } from "wagmi/actions";
import { evolveBeast } from "../../../services/contract-services/EngineServ";

const BeastsOf = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataItems, setDataItems] = useState();
  const [singleItemData, setSingleItemData] = useState(null);
  const authState = useSelector((state: RootState) => state.authSlice);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchBeast = async () => {
    const arrStones = await createItemArray(beastsData);
    setDataItems(arrStones as any);
  };

  const createItemArray = async (data: any) => {
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
              src: data[key].assets.avatar,
              name: data[key].name,
              evolutionable: data[key].evolutionable,
              type: data[key].type,
              hp: data[key].index.hp,
              attack: data[key].index.attack,
              defend: data[key].index.defend,
            });
          }
        }
      })
    );
    return resultArray;
  };

  const handleClickEvolution = async (tokenId: any) => {
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
          const hash = await evolveBeast(
            (authState as any).accountAddr,
            formatUnits(tokenId, 0)
          );

          if (hash) {
            const waitTx = await waitForTransaction({
              hash,
            });

            if (waitTx) {
              fetchBeast();
              message
                .success("Beast evolved successfully!!!")
                .then(() => messageApi.destroy());
            }
          }
        }
      }
    } catch (error) {
      message.error("Transaction error");
      messageApi.destroy();
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleOnItemClick = (data: any) => {
    setSingleItemData(data);
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

    fetchBeast();

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalVisible, authState, messageApi]);

  return (
    <>
      {contextHolder}
      <div className="absolute top-7 left-1">
        <Tooltip placement="right" title="Beasts">
          <div
            onClick={handleOpenModal}
            className="hover:scale-105 cursor-pointer bg-white rounded-full w-[20px] h-[20px] flex items-center justify-center"
          >
            <img
              src="images/gui/Sprite.png"
              className="w-[15px] h-[15px]"
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
              <p className="text-[6px] mb-2">Your Beasts</p>
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
                      <p className="text-[3px]">
                        Type: {(singleItemData as any).type}
                      </p>
                      {(singleItemData as any).evolutionable === true && (
                        <>
                          <p className="text-[3px] whitespace-normal">
                            You need to have evolution stones of the same type
                            as the beast to evolve.
                          </p>
                          <button
                            onClick={() =>
                              handleClickEvolution(
                                (singleItemData as any).itemKey
                              )
                            }
                            className="text-[3px] bg-black text-white px-1 py-1 hover:scale-95 transition-all"
                          >
                            Evolution
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

export default BeastsOf;
