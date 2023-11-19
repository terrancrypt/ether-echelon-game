import EEBanner from "public/EEBanner.png";
import Image from "next/image";
import { rubik } from "@/styles/font";

const Banner = () => {
  return (
    <div className="relative border-b">
      <Image
        src={EEBanner}
        alt="Ether Echelon Banner"
        width={1500}
        height={600}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className={"text-[80px] font-bold ml-4 italic " + rubik.className}>
          EtherEchelon
        </h1>
        <p className="text-xl">The future we belive</p>
      </div>
    </div>
  );
};

export default Banner;
