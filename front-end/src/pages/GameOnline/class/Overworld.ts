import DirectionInput from "./DirectionInput";
import OverworldMap, { OverworldMapConfig } from "./OverworldMap";

interface OverworldConfig {
  element: HTMLElement | null;
}

export interface OverworldMapsData {
  [key: string]: OverworldMapConfig;
}

class Overworld {
  element: HTMLElement | null;
  canvas: HTMLCanvasElement | null | undefined;
  ctx: CanvasRenderingContext2D | null | undefined;
  map: OverworldMap | null;
  directionInput: DirectionInput | null = null;

  constructor(config: OverworldConfig) {
    this.element = config.element;
    this.canvas = this.element?.querySelector(".game-online-canvas");
    this.ctx = this.canvas?.getContext("2d");
    this.map = null;

    this.canvas?.setAttribute("width", "352");
    this.canvas?.setAttribute("height", "198");
  }

  startGameLoop() {
    const step = () => {
      if (this.ctx && this.map && this.canvas) {
        // Clear off the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Establish the camera person
        const cameraPerson = this.map.gameObjects.player;

        // Update all Game Objects
        Object.values(this.map?.gameObjects).forEach((object) => {
          object.update({
            arrow: this.directionInput?.direction,
          });
        });

        //Draw lower layer
        this.map.drawLowerImage(this.ctx, cameraPerson);

        // Draw Game Objects
        Object.values(this.map?.gameObjects).forEach((object) => {
          object.sprite.draw(this.ctx, cameraPerson);
        });

        // Draw upper layer
        this.map.drawUpperImage(this.ctx, cameraPerson);
      }

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init(initData: OverworldMapsData) {
    this.map = new OverworldMap(initData.DemoMap);

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}

export default Overworld;
