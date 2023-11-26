import { Sprites } from "./Sprites";

export class Boundary extends Sprites {
  constructor(x: number, y: number) {
    super(x, y, "");
    this.width = 16 * 4;
    this.height = 16 * 4;
  }
  draw() {
    if (this.ctx && this.width !== undefined && this.height !== undefined) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 0)";
      this.ctx.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  getBounds() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }
}
