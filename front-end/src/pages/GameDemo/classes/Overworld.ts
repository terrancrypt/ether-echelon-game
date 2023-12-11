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

  startMap(
    mapConfig: OverworldMapConfig,
    playerInitialState?: {
      x?: number;
      y?: number;
      direction?: string;
    } | null
  ) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    if (playerInitialState) {
      const { player } = this.map.gameObjects;
      this.map.removeWall(player.x, player.y);
      player.x = playerInitialState.x as number;
      player.y = playerInitialState.y as number;
      player.direction = playerInitialState.direction as string;
      this.map.addWall(player.x, player.y);
    }
  }

  init(initData: OverworldMapsData, isNewPlayer: boolean) {
    this.startMap(initData.ProfessorHouse);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    if (isNewPlayer) {
      this.map?.startCutscene([
        { who: "professorNPC", type: "walk", direction: "up" },
        { who: "professorNPC", type: "walk", direction: "up" },
        { who: "professorNPC", type: "walk", direction: "left" },
        { who: "professorNPC", type: "walk", direction: "left" },
        { who: "professorNPC", type: "walk", direction: "left" },
        { who: "professorNPC", type: "walk", direction: "down" },
        { who: "professorNPC", type: "walk", direction: "down" },
        { who: "professorNPC", type: "walk", direction: "down" },
        { who: "professorNPC", type: "stand", direction: "down", time: 800 },
        { who: "player", type: "stand", direction: "up", time: 800 },
        {
          who: "professorNPC",
          type: "textMessage",
          text: "Welcome to Ether Echelon! I'm Terran!",
        },
        {
          who: "professorNPC",
          type: "textMessage",
          text: "You can use the A W S D keys to move!",
        },
        { who: "professorNPC", type: "walk", direction: "up" },
        { who: "professorNPC", type: "walk", direction: "up" },
        { who: "professorNPC", type: "walk", direction: "up" },
        { who: "professorNPC", type: "walk", direction: "right" },
        { who: "professorNPC", type: "walk", direction: "right" },
        { who: "professorNPC", type: "walk", direction: "right" },
        { who: "professorNPC", type: "walk", direction: "down" },
        { who: "professorNPC", type: "walk", direction: "down" },
      ]);
    }
  }
}

export default Overworld;
