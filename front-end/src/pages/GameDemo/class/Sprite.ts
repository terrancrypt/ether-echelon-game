import { withGrid } from "../utils/utils";
import GameObject from "./GameObject";
import Person from "./Person";

interface AnimationConfig {
  [animationName: string]: number[][];
}

interface SpriteConfig {
  src: string;
  animations?: AnimationConfig;
  currentAnimation?: string;
  gameObject: GameObject;
  isShadow?: boolean;
  animationFrameLimit?: number;
}

class Sprite {
  private image: HTMLImageElement;
  private isLoaded: boolean = false;
  private animations: AnimationConfig;
  private currentAnimation: string;
  private currentAnimationFrame: 0 | 1 | 2 | 3 = 0;
  private animationFrameLimit: number;
  private animationFrameProgress: number;
  private gameObject: GameObject;

  // Shadow
  private shadow: HTMLImageElement;
  private isShadow: boolean;
  private isShadowLoaded: boolean = false;

  constructor(config: SpriteConfig) {
    // Setup the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.isShadow = config.isShadow || true;
    if (this.isShadow) {
      this.shadow.src = "images/Characters/Shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-left": [[0, 2]],
      "idle-up": [[0, 3]],
      "walk-down": [
        [0, 0],
        [1, 0],
        [0, 0],
        [3, 0],
      ],
      "walk-right": [
        [1, 1],
        [0, 1],
        [3, 1],
        [0, 1],
      ],
      "walk-left": [
        [1, 2],
        [0, 2],
        [3, 2],
        [0, 2],
      ],
      "walk-up": [
        [1, 3],
        [0, 3],
        [3, 3],
        [0, 3],
      ],
    };

    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 6;
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  updateAnimationProgress() {
    // Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  setAnimation(key: string) {
    if (this.currentAnimation != key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  draw(
    ctx: CanvasRenderingContext2D | null | undefined,
    cameraPerson: GameObject | Person
  ) {
    const x = this.gameObject.x + 2 + withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 5 + withGrid(6) - cameraPerson.y;

    const [frameX, frameY] = this.frame;

    if (ctx) {
      this.isShadowLoaded && ctx.drawImage(this.shadow, x - 10, y - 14);
      this.isLoaded &&
        ctx.drawImage(
          this.image,
          frameX * 12,
          frameY * 17,
          12,
          16,
          x,
          y,
          12,
          16
        );

      this.updateAnimationProgress();
    }
  }
}

export default Sprite;
