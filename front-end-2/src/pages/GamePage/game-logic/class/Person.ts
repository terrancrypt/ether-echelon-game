import { Sprites } from "./Sprites";
import { KeyboardManager } from "./KeyboardManager";
import { Boundary } from "./Boundary";

export class Person extends Sprites {
  private keyboardManager: KeyboardManager;
  private frameIndex: number = 1;
  private lastUpdateTime: number = 0;
  private animationSpeed: number = 100;
  private movables: (Sprites | Boundary)[];

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
    movables: (Sprites | Boundary)[]
  ) {
    super(x, y, imgSrc);
    this.frame = {
      max: 4,
    };
    this.sprites = sprites;
    this.keyboardManager = new KeyboardManager();
    this.movables = movables;
    if (this.image) this.width = this.image?.width / this.frame.max;
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

        if (this.checkCollisionWithBoundary()) {
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("up", 0);
          });
        } else {
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("up", speed);
          });
        }

        if (this.moving) {
          this.image.src = this.sprites.up;
        }
      } else if (this.keyboardManager.isKeyPressed("s")) {
        this.moving = true;

        if (this.checkCollisionWithBoundary()) {
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("down", 0);
          });
        } else {
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("down", speed);
          });
        }

        if (this.moving) {
          this.image.src = this.sprites.down;
        }
      } else if (this.keyboardManager.isKeyPressed("a")) {
        this.moving = true;

        if (this.moving) {
          this.image.src = this.sprites.left;
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("left", speed);
          });
        }
      } else if (this.keyboardManager.isKeyPressed("d")) {
        this.moving = true;

        this.movables.forEach((movable) => {
          if (movable instanceof Boundary) {
            if (this.width) {
              if (this.position.x + this.width >= movable.position.x) {
                console.log("Colliding!");
              }
            }
          }
        });

        if (this.moving) {
          this.image.src = this.sprites.right;
          this.movables.forEach((movable) => {
            movable.updateMovingPosition("right", speed);
          });
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

  checkCollisionWithBoundary() {
    const personBounds = this.getBounds();
    for (const movable of this.movables) {
      if (movable instanceof Boundary) {
        const boundaryBounds = movable.getBounds();
        if (this.isColliding(personBounds, boundaryBounds)) {
          return true;
        }
      }
    }
    return false;
  }

  isColliding(rect1: any, rect2: any) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  getBounds() {
    if (this.image && this.canvas) {
      const frameWidth = this.image.width / this.frame.max;
      const frameHeight = this.image.height;

      return {
        x: this.canvas.width / 2 - frameWidth / 2,
        y: this.canvas.height / 2 - frameHeight / 2,
        width: frameWidth,
        height: frameHeight,
      };
    }
  }
}
