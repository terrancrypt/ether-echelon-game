import DirectionInput from "./DirectionInput";
import KeyPressListener from "./KeyPressListener";
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
            map: this.map,
          });
        });

        //Draw lower layer
        this.map.drawLowerImage(this.ctx, cameraPerson);

        // Draw Game Objects
        Object.values(this.map?.gameObjects)
          .sort((a, b) => {
            return a.y - b.y; // with this function, we want to draw in order
          })
          .forEach((object) => {
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

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.map?.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e: any) => {
      if (e.detail.whoId === "player") {
        // Hero's position has changed
        this.map?.checkForFootStepCutscene();
      }
    });
  }

  startMap(mapConfig: OverworldMapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init(initData: OverworldMapsData) {
    this.startMap(initData.Town);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { who: "npcA", type: "walk", direction: "up" },
    //   { who: "npcA", type: "stand", direction: "left", time: 800 },
    //   { who: "player", type: "stand", direction: "right", time: 800 },
    //   { who: "npcA", type: "textMessage", text: "WHY HELLO THERE!" },
    // ]);

    this.map?.startCutscene([{ type: "battle" }]);
  }
}

export default Overworld;
