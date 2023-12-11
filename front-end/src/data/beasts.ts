export interface BeastInfor {
  name: string;
  assets: {
    avatar: string;
    inGameImg: string;
  };
  type: "Water" | "Fire" | "Earth" | "Grass" | "Electric";
  rarity: "Normal" | "Rare" | "Epic";
  index: {
    hp: number;
    attack: number;
    defend: number;
    speed: number;
  };
  evolutionable?: boolean;
  evolutionStatus?: {
    toName: string;
    toTokenId: number;
    toFaceset: string;
  };
  evolved?: boolean;
  skills: string[];
}

export interface BeastsData {
  [tokenId: string]: BeastInfor;
}

export const beastsData: BeastsData = {
  "101000": {
    name: "Axolot",
    type: "Water",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 30,
      defend: 50,
      speed: 40,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Axolot/Faceset.png",
      inGameImg: "/images/beasts/Axolot/SpriteSheet.png",
    },
    skills: ["Slash Double", "Water Jet"],
  },
  "101001": {
    name: "Bamboo",
    type: "Grass",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 40,
      defend: 50,
      speed: 30,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Bamboo/Faceset.png",
      inGameImg: "/images/beasts/Bamboo/SpriteSheet.png",
    },
    skills: ["Slash", "Grass Cut"],
  },
  "101002": {
    name: "Butterfly",
    type: "Fire",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 50,
      defend: 30,
      speed: 40,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Butterfly/Faceset.png",
      inGameImg: "/images/beasts/Butterfly/SpriteSheet.png",
    },
    skills: ["Circular Slash", "Burn"],
  },
  "101003": {
    name: "Cyclope",
    type: "Fire",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 60,
      defend: 40,
      speed: 50,
    },
    evolutionable: true,
    evolutionStatus: {
      toFaceset: "/images/beasts/DemonCyclop/Faceset.png",
      toName: "Demon Cyclope",
      toTokenId: 101004,
    },
    assets: {
      avatar: "/images/beasts/Cyclope/Faceset.png",
      inGameImg: "/images/beasts/Cyclope/SpriteSheet.png",
    },
    skills: ["Claw", "Inflame"],
  },
  "101004": {
    name: "Demon Cyclope",
    type: "Fire",
    rarity: "Epic",
    index: {
      hp: 540,
      attack: 80,
      defend: 60,
      speed: 70,
    },
    evolutionable: false,
    evolved: true,
    assets: {
      avatar: "/images/beasts/DemonCyclop/Faceset.png",
      inGameImg: "/images/beasts/DemonCyclop/Sprite.png",
    },
    skills: ["Claw Double", "Fire Ball"],
  },
  "101005": {
    name: "Tiny Dragon",
    type: "Grass",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 40,
      defend: 50,
      speed: 30,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Dragon/Faceset.png",
      inGameImg: "/images/beasts/Dragon/SpriteSheet.png",
    },
    skills: ["Slash", "Grass Cut"],
  },
  "101006": {
    name: "Ghost Eye",
    type: "Water",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 30,
      defend: 50,
      speed: 40,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Eye/Faceset.png",
      inGameImg: "front-end//images/beasts/Eye/SpriteSheet.png",
    },
    skills: ["Slash", "Water Jet"],
  },
  "101007": {
    name: "Flam",
    type: "Fire",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 60,
      defend: 40,
      speed: 50,
    },
    evolutionable: true,
    evolutionStatus: {
      toFaceset: "/images/beasts/GiantFlam/Faceset.png",
      toName: "Giant Flam",
      toTokenId: 101008,
    },
    assets: {
      avatar: "/images/beasts/Flam/Faceset.png",
      inGameImg: "/images/beasts/Flam/SpriteSheet.png",
    },
    skills: ["Increase Attack", "Inflame"],
  },
  "101008": {
    name: "GiantFlam",
    type: "Fire",
    rarity: "Epic",
    index: {
      hp: 540,
      attack: 80,
      defend: 60,
      speed: 70,
    },
    evolutionable: false,
    evolved: true,
    assets: {
      avatar: "/images/beasts/GiantFlam/Faceset.png",
      inGameImg: "/images/beasts/GiantFlam/Idle.png",
    },
    skills: ["Inflame", "Fire Ball"],
  },
  "101009": {
    name: "Racoon",
    type: "Earth",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 40,
      defend: 60,
      speed: 40,
    },
    evolutionable: true,
    evolutionStatus: {
      toFaceset: "/images/beasts/GiantRacoon/Faceset.png",
      toName: "Giant Racoon",
      toTokenId: 101010,
    },
    assets: {
      avatar: "/images/beasts/Racoon/Faceset.png",
      inGameImg: "/images/beasts/Racoon/SpriteSheet.png",
    },
    skills: ["Slash Curved", "Ground Strike"],
  },
  "101010": {
    name: "GiantRacoon",
    type: "Earth",
    rarity: "Epic",
    index: {
      hp: 540,
      attack: 70,
      defend: 80,
      speed: 60,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/GiantRacoon/Faceset.png",
      inGameImg: "/images/beasts/GiantRacoon/Idle.png",
    },
    skills: ["Claw Double", "Stone Crush"],
  },
  "101011": {
    name: "Larva",
    type: "Grass",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 40,
      defend: 50,
      speed: 30,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Larva/Faceset.png",
      inGameImg: "/images/beasts/Larva/SpriteSheet.png",
    },
    skills: ["Healing", "Leaf Storm"],
  },
  "101012": {
    name: "Lizard",
    type: "Earth",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 30,
      defend: 50,
      speed: 40,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Lizard/Faceset.png",
      inGameImg: "/images/beasts/Lizard/SpriteSheet.png",
    },
    skills: ["Slash", "Volcanic Rock"],
  },
  "101013": {
    name: "Mole",
    type: "Earth",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 50,
      defend: 60,
      speed: 40,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Mole/Faceset.png",
      inGameImg: "/images/beasts/Mole/SpriteSheet.png",
    },
    skills: ["Cut", "Burn"],
  },
  "101014": {
    name: "Mollusc",
    type: "Earth",
    rarity: "Rare",
    index: {
      hp: 500,
      attack: 500,
      defend: 500,
      speed: 500,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/Mollusc/Faceset.png",
      inGameImg: "/images/beasts/Mollusc/SpriteSheet.png",
    },
    skills: ["Slash Double Curved", "Ground Strike"],
  },
  "101015": {
    name: "ThunderOwl",
    type: "Electric",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 60,
      defend: 40,
      speed: 60,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/ThunderOwl/Faceset.png",
      inGameImg: "/images/beasts/ThunderOwl/SpriteSheet.png",
    },
    skills: ["Increase Attack", "Thunder"],
  },
  "101016": {
    name: "DemonOwl",
    type: "Fire",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 60,
      defend: 40,
      speed: 50,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/DemonOwl/Faceset.png",
      inGameImg: "/images/beasts/DemonOwl/SpriteSheet.png",
    },
    skills: ["Burn", "Fire Ball"],
  },
  "101017": {
    name: "Slime",
    type: "Water",
    rarity: "Normal",
    index: {
      hp: 450,
      attack: 40,
      defend: 50,
      speed: 40,
    },
    evolutionable: true,
    evolutionStatus: {
      toFaceset: "/images/beasts/SuperSlime/Faceset.png",
      toName: "Super Slime",
      toTokenId: 101018,
    },
    assets: {
      avatar: "/images/beasts/Slime/Faceset.png",
      inGameImg: "/images/beasts/Slime/SpriteSheet.png",
    },
    skills: ["Slash", "Water Jet"],
  },
  "101018": {
    name: "Super Slime",
    type: "Water",
    rarity: "Epic",
    index: {
      hp: 540,
      attack: 80,
      defend: 60,
      speed: 70,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/SuperSlime/Faceset.png",
      inGameImg: "/images/beasts/SuperSlime/SpriteSheet.png",
    },
    skills: ["Ice Spike", "Ice Thorn"],
  },
  "101019": {
    name: "Tiny Grass Snake",
    type: "Grass",
    rarity: "Rare",
    index: {
      hp: 480,
      attack: 50,
      defend: 60,
      speed: 40,
    },
    evolutionable: true,
    evolutionStatus: {
      toFaceset: "/images/beasts/GrassSnake/Faceset.png",
      toName: "Grass Snake",
      toTokenId: 101020,
    },
    assets: {
      avatar: "/images/beasts/TinyGrassSnake/Faceset.png",
      inGameImg: "/images/beasts/TinyGrassSnake/SpriteSheet.png",
    },
    skills: ["Slash Curved", "Leaf Storm"],
  },
  "101020": {
    name: "Grass Snake",
    type: "Grass",
    rarity: "Epic",
    index: {
      hp: 540,
      attack: 70,
      defend: 80,
      speed: 60,
    },
    evolutionable: false,
    assets: {
      avatar: "/images/beasts/GrassSnake/Faceset.png",
      inGameImg: "/images/beasts/GrassSnake/SpriteSheet.png",
    },
    skills: ["Grass Double Cut", "Plant Spike"],
  },
};
