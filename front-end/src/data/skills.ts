interface SkillsData {
  [skillName: string]: {
    type: "Attack" | "Magic" | "Elementals";
    elemental?: "Fire" | "Water" | "Ice" | "Earth" | "Electric" | "Grass";
    target: "Enemy" | "Self";
    orientation: "Shoot" | "Appear" | "Directly";
    power: 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50;
    assets: {
      preview: string;
      spriteSheet: string;
    };
    description: string;
  };
}

export const skillsData: SkillsData = {
  // Attack
  Slash: {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/Slash/Preview.gif",
      spriteSheet: "/images/skills/Slash/SpriteSheet.png",
    },
    description: "A basic slashing attack with moderate power.",
  },
  "Slash Double": {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 30,
    assets: {
      preview: "/images/skills/SlashDouble/Preview.gif",
      spriteSheet: "/images/skills/SlashDouble/SpriteSheet.png",
    },
    description:
      "Execute two quick slashes in succession, dealing higher damage.",
  },
  "Circular Slash": {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/CircularSlash/Preview.gif",
      spriteSheet: "/images/skills/CircularSlash/SpriteSheet.png",
    },
    description:
      "Perform a circular slashing motion to damage all nearby enemies.",
  },
  "Slash Curved": {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/SlashCurved/Preview.gif",
      spriteSheet: "/images/skills/SlashCurved/SpriteSheet.png",
    },
    description: "Unleash a curved slashing attack with precision.",
  },
  "Slash Double Curved": {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 30,
    assets: {
      preview: "/images/skills/SlashDoubleCurved/Sprite.gif",
      spriteSheet: "/images/skills/SlashDoubleCurved/SpriteSheet.png",
    },
    description:
      "Conduct two curved slashes in quick succession, delivering powerful blows.",
  },
  Claw: {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/Claw/Preview.gif",
      spriteSheet: "/images/skills/Claw/SpriteSheet.png",
    },
    description: "Strike the enemy with sharp claws, causing moderate damage.",
  },
  "Claw Double": {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 30,
    assets: {
      preview: "/images/skills/ClawDouble/Preview.gif",
      spriteSheet: "/images/skills/ClawDouble/SpriteSheet.png",
    },
    description:
      "Rapidly attack with both claws, dealing high damage to the target.",
  },
  Cut: {
    type: "Attack",
    target: "Enemy",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/Cut/Preview.gif",
      spriteSheet: "/images/skills/Cut/SpriteSheet.png",
    },
    description:
      "Make a precise cut, aiming for a vulnerable spot on the enemy.",
  },

  // Magic
  Healing: {
    type: "Magic",
    target: "Self",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/Healing/Preview.gif",
      spriteSheet: "/images/skills/Healing/SpriteSheetPurple.png",
    },
    description: "Restores own health.",
  },
  "Increase Attack": {
    type: "Magic",
    target: "Self",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/IncreaseAttack/PreviewSpark.gif",
      spriteSheet: "/images/skills/IncreaseAttack/SpriteSheetSpark.png",
    },
    description: "Increase attack power.",
  },
  Shield: {
    type: "Magic",
    target: "Self",
    orientation: "Appear",
    power: 20,
    assets: {
      preview: "/images/skills/Shield/Preview.gif",
      spriteSheet: "/images/skills/Shield/SpriteSheetBlue.png",
    },
    description: "Increase defend index.",
  },

  // Elementals
  // Fire
  Burn: {
    type: "Elementals",
    elemental: "Fire",
    target: "Enemy",
    orientation: "Appear",
    power: 30,
    assets: {
      preview: "/images/skills/Burn/Preview.gif",
      spriteSheet: "/images/skills/Burn/SpriteSheet.png",
    },
    description: "Engulf the enemy in flames with a burst of fiery energy.",
  },
  Inflame: {
    type: "Elementals",
    elemental: "Fire",
    target: "Enemy",
    orientation: "Appear",
    power: 35,
    assets: {
      preview: "/images/skills/Inflame/Preview.gif",
      spriteSheet: "front-end/images/skills/Inflame/SpriteSheet.png",
    },
    description:
      "Ignite the target with an intense burst of fire, causing continuous damage.",
  },
  "Fire Ball": {
    type: "Elementals",
    elemental: "Fire",
    target: "Enemy",
    orientation: "Shoot",
    power: 40,
    assets: {
      preview: "/images/skills/Fireball/Preview.gif",
      spriteSheet: "/images/skills/Fireball/SpriteSheet.png",
    },
    description:
      "Hurl a blazing fireball at the enemy, causing significant damage upon impact.",
  },

  // Earth
  "Ground Strike": {
    type: "Elementals",
    elemental: "Earth",
    target: "Enemy",
    orientation: "Directly",
    power: 30,
    assets: {
      preview: "/images/skills/GroundStrike/Preview.gif",
      spriteSheet: "/images/skills/GroundStrike/SpriteSheet.png",
    },
    description:
      "Strike the ground with immense force, causing a shockwave to damage the enemy.",
  },
  "Volcanic Rock": {
    type: "Elementals",
    elemental: "Earth",
    target: "Enemy",
    orientation: "Shoot",
    power: 35,
    assets: {
      preview: "/images/skills/VolcanicRock/Preview.gif",
      spriteSheet: "/images/skills/VolcanicRock/SpriteSheet.png",
    },
    description:
      "Launch volcanic rocks at the enemy, dealing damage upon impact.",
  },
  "Stone Crush": {
    type: "Elementals",
    elemental: "Earth",
    target: "Enemy",
    orientation: "Appear",
    power: 40,
    assets: {
      preview: "/images/skills/StoneCrush/Preview.gif",
      spriteSheet: "/images/skills/StoneCrush/SpriteSheet.png",
    },
    description:
      "Summon a giant stone to crush the enemy, inflicting heavy damage.",
  },

  // Grass
  "Grass Cut": {
    type: "Elementals",
    elemental: "Grass",
    target: "Enemy",
    orientation: "Appear",
    power: 30,
    assets: {
      preview: "/images/skills/GrassCut/Preview.gif",
      spriteSheet: "/images/skills/GrassCut/SpriteSheet.png",
    },
    description:
      "Cut through the enemy with sharp grass blades, causing moderate damage.",
  },
  "Grass Double Cut": {
    type: "Elementals",
    elemental: "Grass",
    target: "Enemy",
    orientation: "Appear",
    power: 40,
    assets: {
      preview: "/images/skills/GrassDoubleCut/Preview.gif",
      spriteSheet: "/images/skills/GrassDoubleCut/SpriteSheet.png",
    },
    description:
      "Execute two swift cuts with razor-sharp grass blades, dealing high damage.",
  },
  "Leaf Storm": {
    type: "Elementals",
    elemental: "Grass",
    target: "Enemy",
    orientation: "Appear",
    power: 35,
    assets: {
      preview: "/images/skills/LeafStorm/Preview.gif",
      spriteSheet: "/images/skills/LeafStorm/SpriteSheet.png",
    },
    description:
      "Create a powerful storm of razor-sharp leaves, damaging all enemies in its path.",
  },
  "Plant Spike": {
    type: "Elementals",
    elemental: "Grass",
    target: "Enemy",
    orientation: "Shoot",
    power: 45,
    assets: {
      preview: "/images/skills/PlantSpike/Preview.gif",
      spriteSheet: "/images/skills/PlantSpike/SpriteSheet.png",
    },
    description:
      "Shoot sharp plant spikes at the enemy, causing piercing damage.",
  },

  // Water
  "Water Jet": {
    type: "Elementals",
    elemental: "Water",
    target: "Enemy",
    orientation: "Appear",
    power: 35,
    assets: {
      preview: "/images/skills/WaterJet/Preview.gif",
      spriteSheet: "/images/skills/WaterJet/SpriteSheet.png",
    },
    description:
      "Release a high-pressure jet of water at the enemy, dealing moderate damage.",
  },
  "Water Ball": {
    type: "Elementals",
    elemental: "Water",
    target: "Enemy",
    orientation: "Shoot",
    power: 40,
    assets: {
      preview: "/images/skills/WaterBall/Preview.gif",
      spriteSheet: "/images/skills/WaterBall/SpriteSheet.png",
    },
    description:
      "Form a water ball and hurl it at the enemy, causing significant damage upon impact.",
  },

  // Ice
  "Ice Spike": {
    type: "Elementals",
    elemental: "Ice",
    target: "Enemy",
    orientation: "Shoot",
    power: 35,
    assets: {
      preview: "/images/skills/IceSpike/Preview.gif",
      spriteSheet: "/images/skills/IceSpike/SpriteSheet.png",
    },
    description:
      "Shoot sharp ice spikes at the enemy, causing piercing damage.",
  },
  "Ice Thorn": {
    type: "Elementals",
    elemental: "Ice",
    target: "Enemy",
    orientation: "Appear",
    power: 40,
    assets: {
      preview: "/images/skills/IceThorn/Preview.gif",
      spriteSheet: "/images/skills/IceThorn/SpriteSheet.png",
    },
    description:
      "Summon ice thorns that emerge from the ground, damaging the enemy upon appearance.",
  },

  // Electric
  Thunder: {
    type: "Elementals",
    elemental: "Electric",
    target: "Enemy",
    orientation: "Appear",
    power: 40,
    assets: {
      preview: "/images/skills/Thunder/Preview.gif",
      spriteSheet: "/images/skills/Thunder/SpriteSheet.png",
    },
    description:
      "Summon a powerful thunderbolt to strike the enemy, dealing high electric damage.",
  },
};
