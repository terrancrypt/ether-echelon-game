import OverworldMap from "./OverworldMap";
import Sprite from "./Sprite";

export interface GameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: string;
  map?: string;
}

class GameObject {
  x: number;
  y: number;
  isMounted: boolean;
  sprite: Sprite;
  direction: string;

  constructor(config: GameObjectConfig) {
    this.x = config.x;
    this.y = config.y;
    this.isMounted = false;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      src: config.src,
      gameObject: this,
    });
  }

  update() {}
}

export default GameObject;
