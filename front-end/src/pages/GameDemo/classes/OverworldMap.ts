import { nextPosition, withGrid } from "../utils/utils";
import GameObject from "./GameObject";
import Overworld from "./Overworld";
import OverworldEvent, { EventConfig } from "./OverworldEvent";
import Person from "./Person";

export interface OverworldMapConfig {
  gameObjects: { [key: string]: GameObject | Person };
  walls: { [key: string]: boolean };
  lowerSrc: string;
  upperSrc: string;
  cutsceneSpaces?: {
    [key: string]: {
      events: EventConfig[];
    }[];
  };
}

class OverworldMap {
  public overworld: Overworld | null;
  public gameObjects: { [key: string]: Person | GameObject };
  public walls: {
    [key: string]: boolean;
  } = {};
  private lowerImage: HTMLImageElement;
  private upperImage: HTMLImageElement;
  public isCutscenePlaying: boolean;
  private cutsceneSpaces?: any;

  constructor(config: OverworldMapConfig) {
    this.overworld = null;

    this.gameObjects = config.gameObjects;
    this.walls = config.walls;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.cutsceneSpaces = config.cutsceneSpaces;
  }

  drawLowerImage(
    ctx: CanvasRenderingContext2D | null,
    cameraPerson: GameObject | Person
  ) {
    ctx?.drawImage(
      this.lowerImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(
    ctx: CanvasRenderingContext2D | null,
    cameraPerson: GameObject | Person
  ) {
    ctx?.drawImage(
      this.upperImage,
      withGrid(10.5) - cameraPerson.x,
      withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX: number, currentY: number, direction: string) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;

      // TODO: etermine if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events: EventConfig[]) {
    this.isCutscenePlaying = true;

    // Start a loop of async events
    // Await each one
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventHandler = new OverworldEvent({
        map: this,
        eventConfig: {
          type: event.type,
          direction: event.direction,
          time: event.time,
          who: event.who,
          text: event.text,
          faceHero: event.faceHero,
          map: event.map,
          x: event.x,
          y: event.y,
        },
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do their indle behavior
    Object.values(this.gameObjects).forEach((object) =>
      object.doBehaviorEvent(this)
    );
  }

  checkForActionCutscene() {
    const player = this.gameObjects["player"];
    const nextCoords = nextPosition(player.x, player.y, player.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });

    if (!this.isCutscenePlaying && match && match.talking != undefined) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootStepCutscene() {
    const player = this.gameObjects["player"];
    if (this.cutsceneSpaces) {
      const match = this.cutsceneSpaces[`${player.x},${player.y}`];
      if (!this.isCutscenePlaying && match) {
        this.startCutscene(match[0].events);
      }
    }
  }

  addWall(x: number, y: number) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x: number, y: number) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX: number, wasY: number, direction: string) {
    this.removeWall(wasX, wasY);
    const { x, y } = nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

export default OverworldMap;
