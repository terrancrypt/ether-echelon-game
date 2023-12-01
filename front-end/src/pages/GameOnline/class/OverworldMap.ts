import { withGrid } from "../utils/utils";
import GameObject from "./GameObject";
import Person from "./Person";

export interface OverworldMapConfig {
  gameObjects: { [key: string]: GameObject | Person };
  lowerSrc: string;
  upperSrc: string;
}

class OverworldMap {
  public gameObjects: { [key: string]: GameObject | Person };
  private lowerImage: HTMLImageElement;
  private upperImage: HTMLImageElement;

  constructor(config: OverworldMapConfig) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
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
}

export default OverworldMap;
