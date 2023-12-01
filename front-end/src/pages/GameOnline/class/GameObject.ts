import Sprite from "./Sprite";

export interface GameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: "up" | "down" | "left" | "right";
}

class GameObject {
  x: number;
  y: number;
  sprite: Sprite;
  direction: string;

  constructor(config: GameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });
  }

  update() {}
}

export default GameObject;
