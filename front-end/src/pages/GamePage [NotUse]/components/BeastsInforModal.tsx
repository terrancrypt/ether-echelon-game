import { useState } from "react";

const BeastsInforModal = () => {
  const [beast, setBeast] = useState<string>("");

  console.log(beast);

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="grid grid-cols-4 gap-6 flex-1">
        <div
          onClick={() => setBeast("Axolot")}
          className="w-[60px] h-[60px] bg-black"
        ></div>
        <div
          onClick={() => setBeast("Bamboo")}
          className="w-[60px] h-[60px] bg-black"
        ></div>
      </div>
      {/* Beast Information */}
      <div className=" w-[400px]">
        <div>{beast}</div>
      </div>
    </div>
  );
};

export default BeastsInforModal;
