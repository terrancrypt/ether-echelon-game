export type SkillsType = {
  name: string;
  assets: {
    preview: string;
    spriteSheet: string;
  };
  elemental?: string;
  description: string;
  power: number;
  target: string;
  type: string;
};
