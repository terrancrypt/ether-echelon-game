interface ChestInfor {
  name: string;
  image: string;
}

interface ChestData {
  [tokenId: string]: ChestInfor;
}

const chestsData: ChestData = {
  "102000": {
    name: "Normal Chest",
    image: "/src/assets/items/chests/NormalChest.png",
  },
  "102001": {
    name: "Rare Chest",
    image: "/src/assets/items/chests/RareChest.png",
  },
  "102002": {
    name: "Epic Chest",
    image: "/src/assets/items/chests/EpicChest.png",
  },
};

export default chestsData;
