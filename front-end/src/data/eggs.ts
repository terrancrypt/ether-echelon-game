interface EggInfor {
  name: string;
  image: string;
  incubateTime: number;
}

interface EggsData {
  [tokenId: string]: EggInfor;
}

const eggsData: EggsData = {
  "104000": {
    name: "Grass Snake Egg",
    image: "/images/items/eggs/GrassSnakeEgg.png",
    incubateTime: 60,
  },
  "104001": {
    name: "Thunder Owl Egg",
    image: "/images/items/eggs/ThunderOwlEgg.png",
    incubateTime: 900,
  },
  "104002": {
    name: "Demon Owl Egg",
    image: "/images/items/eggs/DemonOwlEgg.png",
    incubateTime: 900,
  },
};

export default eggsData;
