interface BeastsData {
  [beastName: string]: {
    name: string;
    assets: {
      avatar: string;
      inGameImg: string;
    };
    evolutionable: boolean;
    type: "Water" | "Fire" | "Ice" | "Earth" | "Grass" | "Insect" | "Thunder";
    index: {
      hp: number;
      attack: number;
      defend: number;
    };
    skills: string[];
  };
}

export const beastsData: BeastsData = {
  RedButterfly: {
    name: "Red ButterFly",
    assets: {
      avatar: "src/assets/beasts/ButterflyRed/Faceset.png",
      inGameImg: "src/assets/beasts/ButterflyRed/SpriteSheet.png",
    },
    evolutionable: false,
    type: "Fire",
    index: {
      hp: 100,
      attack: 20,
      defend: 10,
    },
    skills: ["Burn"],
  },
  Axolot: {
    name: "Axolot",
    assets: {
      avatar: "src/assets/beasts/Axolot/Faceset.png",
      inGameImg: "src/assets/beasts/Axolot/SpriteSheet.png",
    },
    evolutionable: false,
    type: "Water",
    index: {
      hp: 100,
      attack: 20,
      defend: 10,
    },
    skills: ["Water Jet"],
  },
  Bamboo: {
    name: "Bamboo",
    assets: {
      avatar: "src/assets/beasts/Bamboo/Faceset.png",
      inGameImg: "src/assets/beasts/Bamboo/SpriteSheet.png",
    },
    evolutionable: false,
    type: "Water",
    index: {
      hp: 100,
      attack: 20,
      defend: 10,
    },
    skills: ["Water Jet"],
  },
};
