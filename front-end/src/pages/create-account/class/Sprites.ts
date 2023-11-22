export class Sprites {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null | undefined;
  position: {
    x: number;
    y: number;
  };
  image: HTMLImageElement | undefined;
  width: number | undefined;
  height: number | undefined;
  frame: {
    max: number;
    hold: number;
  };

  constructor(x: number, y: number, imgSrc: string) {
    this.canvas = document.querySelector("#inGameImage");
    this.ctx = this.canvas?.getContext("2d");
    (this.position = { x, y }), (this.image = new Image());

    this.image.onload = () => {
      this.width = this.image?.width;
      this.height = this.image?.height;
    };

    this.image.src = imgSrc;

    this.frame = {
      max: 4,
      hold: 10,
    };
  }

  draw() {
    if (this.canvas && this.image && this.width && this.height) {
      this.ctx?.drawImage(this.image, this.image.width / 2 / 4, 0, 0, 0);
    }
  }
}
