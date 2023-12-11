interface StoneInfor {
  name: string;
  image: string;
}

interface StonesData {
  [tokenId: string]: StoneInfor;
}

const stonesData: StonesData = {
  "103000": {
    name: "FireStone",
    image: "/images/items/stones/FireStone.png",
  },
  "103001": {
    name: "GrassStone",
    image: "/images/items/stones/GrassStone.png",
  },
  "103002": {
    name: "WaterStone",
    image: "/images/items/stones/WaterStone.png",
  },
  "103003": {
    name: "EarthStone",
    image: "/images/items/stones/EarthStone.png",
  },
};

export default stonesData;
