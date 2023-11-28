import { useState } from "react";
import { shortenAddr } from "../../../utils/addrUtils";
import BeastsInforModal from "./BeastsInforModal";

const PlayerInfor = () => {
  const [modalStates, setModalStates] = useState({
    playerInfor: false,
    bagInfor: false,
    beastsInfor: false,
  });

  const handleIconClick = (modalName: string) => {
    setModalStates((prev) => ({ ...prev, [modalName]: true }));
  };

  const handleCloseModal = () => {
    setModalStates({
      playerInfor: false,
      bagInfor: false,
      beastsInfor: false,
    });
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="absolute top-2 left-3 z-10">
        <div
          onClick={() => handleIconClick("playerInfor")}
          className="relative hover:scale-90 cursor-pointer"
        >
          <img width={60} height={60} src="/images/GUI/User_White.png" alt="" />
        </div>
        <div
          onClick={() => handleIconClick("bagInfor")}
          className="relative mt-2 hover:scale-90 cursor-pointer"
        >
          <img
            width={60}
            height={60}
            src="/images/GUI/Handbag_White.png"
            alt=""
          />
        </div>

        <div
          onClick={() => handleIconClick("beastsInfor")}
          className="relative mt-2 hover:scale-90 cursor-pointer"
        >
          <img
            width={60}
            height={60}
            src="/images/GUI/Android_White.png"
            alt=""
          />
        </div>
      </div>

      {/* Modal */}
      <div
        className="absolute w-full h-full top-0 left-0 flex items-center justify-center"
        onClick={handleCloseModal}
      >
        {/* Player Infor Modal */}
        {modalStates.playerInfor && (
          <div
            className="game-modal bg-white bg-opacity-90 rounded-lg  border-2 p-10 relative text-black"
            onClick={stopPropagation}
          >
            <div
              onClick={handleCloseModal}
              className="absolute -top-5 -right-4 w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center hover:scale-90 cursor-pointer shadow-2xl"
            >
              <img
                src="/images/GUI/Plus.png"
                alt=""
                className="w-[20px] h-[20px] rotate-45"
              />
            </div>
            <h2 className="text-center font-bold mb-4 text-3xl">Information</h2>
            <div className="text-left space-y-2">
              <table>
                <tbody className="w-full">
                  <tr>
                    <td className="py-2 px-4">Account Id</td>
                    <td className="px-6">12</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Character</td>
                    <td className="px-6">Lumber Jack</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Wallet Address</td>
                    <td className="px-6">
                      {shortenAddr(
                        "0x5082f249cdb2f2c1ee035e4f423c46ea2dab3ab1"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">Account Address</td>
                    <td className="px-6">
                      {shortenAddr(
                        "0x5082f249cdb2f2c1ee035e4f423c46ea2dab3ab1"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Player Bag Item Modal */}
        {modalStates.bagInfor && (
          <div
            className="game-modal bg-white bg-opacity-90 rounded-lg  border-2 p-10 relative text-black"
            onClick={stopPropagation}
          >
            <div
              onClick={handleCloseModal}
              className="absolute -top-5 -right-4 w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center hover:scale-90 cursor-pointer shadow-2xl"
            >
              <img
                src="/images/GUI/Plus.png"
                alt=""
                className="w-[20px] h-[20px] rotate-45"
              />
            </div>
            <h2 className="text-center font-bold mb-4 text-3xl">Bag</h2>
          </div>
        )}

        {modalStates.beastsInfor && (
          <div
            className="game-modal bg-white bg-opacity-90 rounded-lg  border-2 p-10 relative text-black"
            onClick={stopPropagation}
          >
            <div
              onClick={handleCloseModal}
              className="absolute -top-5 -right-4 w-[40px] h-[40px] bg-black rounded-full flex justify-center items-center hover:scale-90 cursor-pointer shadow-2xl"
            >
              <img
                src="/images/GUI/Plus.png"
                alt=""
                className="w-[20px] h-[20px] rotate-45"
              />
            </div>
            <h2 className="text-center font-bold mb-6 text-3xl">
              Ether Beasts
            </h2>
            <BeastsInforModal />
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerInfor;
