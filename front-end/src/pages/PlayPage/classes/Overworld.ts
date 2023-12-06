import {
  Database,
  DatabaseReference,
  Query,
  onChildAdded,
  onChildRemoved,
  onValue,
  ref,
} from "firebase/database";
import OverworldMap from "./OverworldMap";
import mapData from "../mapData";
import GameObject from "./GameObject";
import { charactersData } from "../../../data/charaters";
import DirectionInput from "./DirectionInput";
import Player from "./Player";

interface OverworldConfig {
  element: HTMLElement | null;
  database: Database;
}

class Overworld {
  element: HTMLElement | null;
  canvas: HTMLCanvasElement | null | undefined;
  ctx: CanvasRenderingContext2D | null | undefined;
  allPlayerRef: DatabaseReference | null;
  map: OverworldMap | null;
  gameObjects: {
    [id: string]: GameObject | Player;
  };
  directionInput: DirectionInput | null = null;

  constructor(config: OverworldConfig) {
    this.element = config.element;
    this.canvas = this.element?.querySelector(".play-canvas");
    this.ctx = this.canvas?.getContext("2d");

    this.canvas?.setAttribute("width", "352");
    this.canvas?.setAttribute("height", "198");

    this.map = null;
    this.gameObjects = {};

    // Firebase
    this.allPlayerRef = ref(config.database, "players");
  }

  startGameLoop() {
    const step = () => {
      if (this.ctx && this.canvas && this.map) {
        // Clear off the canvas
        this.ctx.clearRect(0, 0, this.canvas?.width, this.canvas.height);

        // Update Game Objects
        Object.values(this.gameObjects).forEach((object) => {
          object.update({
            arrow: this.directionInput?.direction,
            map: this.map,
          });
        });

        // Draw Lower Layer
        this.map?.drawLowerImage(this.ctx);

        // Draw Game Objects
        Object.values(this.gameObjects).forEach((object) => {
          object.sprite.draw(this.ctx);
        });

        // Draw Upper Layer
        this.map?.drawUpperImage(this.ctx);
      }

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    onValue(this.allPlayerRef as Query, (snapshot) => {
      const allPlayerData = snapshot.val();

      Object.values(allPlayerData).forEach((object: any) => {
        if (this.gameObjects[object.id]) {
          this.gameObjects[object.id].direction = object.direction;
          (this.gameObjects[object.id].x = object.position.x),
            (this.gameObjects[object.id].y = object.position.y);
        } else {
          const imageSrc = charactersData[object.character].sprites;
          const player = new Player({
            id: object.id,
            x: object.position.x,
            y: object.position.y,
            src: imageSrc,
            direction: object.direction,
          });
          this.gameObjects[object.id] = player;
        }
      });
    });

    onChildAdded(this.allPlayerRef as Query, (snapshot) => {
      const addedPlayer = snapshot.val();

      const imageSrc = charactersData[addedPlayer.character].sprites;

      const player = new Player({
        id: addedPlayer.id,
        x: addedPlayer.position.x,
        y: addedPlayer.position.y,
        src: imageSrc,
        direction: addedPlayer.direction,
      });

      this.gameObjects[addedPlayer.id] = player;
    });

    onChildRemoved(this.allPlayerRef as Query, (snapshot) => {
      const removedPlayer = snapshot.val();
      delete this.gameObjects[removedPlayer.id];
    });

    this.map = new OverworldMap(mapData.ProfessorHouse);

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}

export default Overworld;
