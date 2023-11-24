import { collisionsData } from "@/data/collisions";
import { Boundary } from "./Boundary";
import { Sprites } from "./Sprites";

class KeyboardManager {
  private keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  isKeyPressed(key: string): boolean {
    return !!this.keys[key];
  }
}

export class Person extends Sprites {
  private keyboardManager: KeyboardManager;
  private overworld: Sprites | null = null;
  private frameIndex: number = 1;
  private lastUpdateTime: number = 0;
  private animationSpeed: number = 100;

  frame: {
    max: number;
  };
  sprites: {
    up: string;
    down: string;
    left: string;
    right: string;
  };

  constructor(
    x: number,
    y: number,
    imgSrc: string,
    sprites: {
      up: string;
      down: string;
      left: string;
      right: string;
    },
    overworld: Sprites
  ) {
    super(x, y, imgSrc);
    this.frame = {
      max: 4,
    };
    this.sprites = sprites;
    this.keyboardManager = new KeyboardManager();
    this.overworld = overworld;
  }

  draw() {
    if (this.image && this.canvas) {
      const frameWidth = this.image.width / this.frame.max;
      const frameHeight = this.image.height;

      const sourceX = (this.frameIndex - 1) * frameWidth;
      const sourceY = 0;

      this.ctx?.drawImage(
        this.image,
        sourceX,
        sourceY,
        frameWidth,
        frameHeight,
        this.canvas.width / 2 - 192 / 4 / 2,
        this.canvas.height / 2 - 68 / 2,
        frameWidth,
        this.image.height
      );
    }
  }

  update() {
    const speed = 3;
    this.moving = false;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;

    if (this.image) {
      if (this.keyboardManager.isKeyPressed("w")) {
        this.moving = true;
        if (this.moving) {
          this.image.src = this.sprites.up;
          this.overworld?.updateMovingPosition("up", speed);
        }
      } else if (this.keyboardManager.isKeyPressed("s")) {
        this.moving = true;
        if (this.moving) {
          this.image.src = this.sprites.down;
          this.overworld?.updateMovingPosition("down", speed);
        }
      } else if (this.keyboardManager.isKeyPressed("a")) {
        this.moving = true;
        if (this.moving) {
          this.image.src = this.sprites.left;
          this.overworld?.updateMovingPosition("left", speed);
        }
      } else if (this.keyboardManager.isKeyPressed("d")) {
        this.moving = true;
        if (this.moving) {
          this.image.src = this.sprites.right;
          this.overworld?.updateMovingPosition("right", speed);
        }
      }
    }

    if (this.moving && deltaTime >= this.animationSpeed) {
      this.frameIndex = (this.frameIndex % this.frame.max) + 1;
      this.lastUpdateTime = currentTime;
    } else if (!this.moving) {
      this.frameIndex = 1;
    }
  }
}
