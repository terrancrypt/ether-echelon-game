import { Tooltip, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { formatUnits } from "viem";
import eggsData from "../../../data/eggs";

import { waitForTransaction } from "wagmi/actions";
import {
  getAccountIsIncubateEgg,
  getEggIncubatedStartTime,
  hatchEgg,
} from "../../../services/contract-services/EngineServ";

const Incubation = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const authState = useSelector((state: RootState) => state.authSlice);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataItems, setDataItems] = useState();
  const [singleItemData, setSingleItemData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchIncubation = async () => {
    const arrResult: any = [];
    await Promise.all(
      Object.keys(eggsData).map(async (key) => {
        const isIncubate = await getAccountIsIncubateEgg(
          (authState as any).accountAddr,
          key
        );
        console.log(key, isIncubate);

        if (isIncubate) {
          const startTime = await getEggIncubatedStartTime(
            (authState as any).accountAddr,
            key
          );

          const startDate = formatUnits(startTime as any, 0);
          const dateFormat = new Date(Number(startDate) * 1000);
          const currentDate = new Date();
          const timeDifferenceInSeconds = Math.floor(
            (Number(currentDate) - Number(dateFormat)) / 1000
          );
          const isCanHatch =
            timeDifferenceInSeconds >= eggsData[key].incubateTime;

          arrResult.push({
            tokenId: key,
            src: eggsData[key].image,
            name: eggsData[key].name,
            canHatch: isCanHatch,
          });
        }
      })
    );
    setDataItems(arrResult);
  };

  const handleHatchEgg = async (tokenId: any) => {
    try {
      messageApi.open({
        type: "loading",
        content: "Transaction in progress...",
        duration: 0,
      });

      const hash = await hatchEgg(
        (authState as any).accountAddr,
        formatUnits(tokenId, 0)
      );

      if (hash) {
        const waitTx = await waitForTransaction({
          hash,
        });

        if (waitTx) {
          fetchIncubation();
          message
            .success("Eggs hatched successfully!!!!")
            .then(() => messageApi.destroy());
        }
      }
    } catch (error) {
      message.error("Transaction error");
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

    fetchIncubation();

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalVisible, authState, messageApi]);

  return (
    <>
      {contextHolder}
      <div className="absolute top-[52px] left-1">
        <Tooltip placement="right" title="Incubation">
          <div
            onClick={handleOpenModal}
            className="hover:scale-105 cursor-pointer bg-white rounded-full w-[20px] h-[20px] flex items-center justify-center"
          >
            <img
              src="images/gui/Egg.png"
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
              <p className="text-[6px] mb-2">Incubation</p>
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
                      {(singleItemData as any).canHatch ? (
                        <button
                          onClick={() =>
                            handleHatchEgg((singleItemData as any).tokenId)
                          }
                          className="text-[3px] bg-black text-white px-1 py-1 hover:scale-95 transition-all"
                        >
                          Hatch Egg
                        </button>
                      ) : (
                        <p className="text-[3px] ml-1">
                          Eggs are being incubated
                        </p>
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

export default Incubation;
