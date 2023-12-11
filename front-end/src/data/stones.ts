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
    image: "/src/assets/items/stones/FireStone.png",
  },
  "103001": {
    name: "GrassStone",
    image: "/src/assets/items/stones/GrassStone.png",
  },
  "103002": {
    name: "WaterStone",
    image: "/src/assets/items/stones/WaterStone.png",
  },
  "103003": {
    name: "EarthStone",
    image: "/src/assets/items/stones/EarthStone.png",
  },
};

export default stonesData;
