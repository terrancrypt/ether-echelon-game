import { nextPosition, withGrid } from "../utils/utils";
import GameObject from "./GameObject";
import Player from "./Player";

interface OverworldMapConfig {
  walls: { [key: string]: boolean };
  lowerSrc: string;
  upperSrc: string;
  gameObjects: { [id: string]: GameObject } | null;
}

class OverworldMap {
  private lowerImage: HTMLImageElement;
  private upperImage: HTMLImageElement;
  public gameObjects: {
    [id: string]: GameObject | Player;
  } | null;
  walls: { [key: string]: boolean };

  constructor(config: OverworldMapConfig) {
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.gameObjects = config.gameObjects;
    this.walls = config.walls;
  }

  drawLowerImage(
    ctx: CanvasRenderingContext2D | null
    // cameraPerson: GameObject | Person
  ) {
    ctx?.drawImage(
      this.lowerImage,
      //   withGrid(10.5) - cameraPerson.x,
      //   withGrid(6) - cameraPerson.y
      0,
      0
    );
  }

  drawUpperImage(
    ctx: CanvasRenderingContext2D | null
    // cameraPerson: GameObject | Person
  ) {
    ctx?.drawImage(
      this.upperImage,
      //   withGrid(10.5) - cameraPerson.x,
      //   withGrid(6) - cameraPerson.y
      0,
      0
    );
  }

  isSpaceTaken(currentX: number, currentY: number, direction: string) {
    const { x, y } = nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
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
