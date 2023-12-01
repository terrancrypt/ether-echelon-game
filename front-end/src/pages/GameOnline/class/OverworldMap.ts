import { nextPosition, withGrid } from "../utils/utils";
import GameObject from "./GameObject";
import Person from "./Person";

export interface OverworldMapConfig {
  gameObjects: { [key: string]: GameObject | Person };
  walls: {};
  lowerSrc: string;
  upperSrc: string;
}

class OverworldMap {
  public gameObjects: { [key: string]: GameObject | Person };
  public walls: {
    [key: string]: boolean;
  } = {};
  private lowerImage: HTMLImageElement;
  private upperImage: HTMLImageElement;
  public isCutscenePlaying: boolean;

  constructor(config: OverworldMapConfig) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
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
