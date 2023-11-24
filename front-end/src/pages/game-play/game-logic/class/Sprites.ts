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

  moving: boolean;

  constructor(x: number, y: number, imgSrc: string) {
    this.canvas = document.querySelector("#GameCanvas");
    this.ctx = this.canvas?.getContext("2d");
    (this.position = { x, y }), (this.image = new Image());

    this.image.onload = () => {
      this.width = this.image?.width;
      this.height = this.image?.height;
    };

    this.image.src = imgSrc;

    this.moving = true;
  }

  clearRect() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  draw() {
    if (this.canvas && this.image && this.width && this.height) {
      this.ctx?.drawImage(this.image, this.position.x, this.position.y);
    }
  }

  updatePosition() {
    if (this.width && this.height && this.canvas) {
      if (this.moving) {
        if (this.position.x > -900) {
          this.position.x -= 1;
        } else {
          this.moving = false;
        }
      } else {
        if (this.position.x < 0) {
          this.position.x += 1;
        } else {
          this.moving = true;
        }
      }
    }
  }

  updateMovingPosition(direction: string, speed: number) {
    if (direction === "up") {
      this.position.y += speed;
    }
    if (direction === "down") {
      this.position.y -= speed;
    }
    if (direction === "left") {
      this.position.x += speed;
    }
    if (direction === "right") {
      this.position.x -= speed;
    }
  }
}
