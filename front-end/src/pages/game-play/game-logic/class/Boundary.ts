export class Boundary {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;
  width: number | undefined;
  height: number | undefined;
  position: {
    x: number;
    y: number;
  };
  constructor(x: number, y: number) {
    this.canvas = document.querySelector("#GameCanvas");
    this.ctx = this.canvas?.getContext("2d");
    this.position = { x, y };
    this.width = 16 * 4;
    this.height = 16 * 4;
  }
  draw() {
    if (this.ctx && this.width !== undefined && this.height !== undefined) {
      this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
      this.ctx.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
}
