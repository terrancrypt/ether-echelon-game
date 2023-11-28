interface BeastsData {
  [beastName: string]: {
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
    assets: {
      avatar: "",
      inGameImg: "",
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
    assets: {
      avatar: "",
      inGameImg: "",
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
