import { DatabaseReference, ref, update } from "firebase/database";
import GameObject, { GameObjectConfig } from "./GameObject";
import OverworldMap from "./OverworldMap";
import {
  playerId,
  realtimeDatabase,
} from "../../../services/firebase/firebase";
import { emitEvent } from "../utils/utils";

interface StateUpdate {
  arrow?: string | undefined;
  map: OverworldMap | null;
}

interface PlayerConfig extends GameObjectConfig {
  id: string;
}

class Player extends GameObject {
  id: string;
  movingProgressRemaining: number;
  private directionUpdate: {
    [key: string]: [string, number];
  };
  [key: string]: any;
  playerRef: DatabaseReference;

  constructor(config: PlayerConfig) {
    super(config);
    this.id = config.id;
    this.movingProgressRemaining = 0;
    this.playerRef = ref(realtimeDatabase, `players/${this.id}`);

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state?: StateUpdate): void {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      // More cases for starting to walk

      // Case: there is not have cutscene and player with arrow is pressed
      if (state?.arrow && this.id === playerId) {
        this.startBehavior({
          type: "walk",
          direction: state.arrow,
          map: state.map,
        });
      }
      this.updateSprite();
    }
  }

  // Behavior witt npc and sometime with player if cutscene on fire
  startBehavior(
    state?: StateUpdate & {
      type: string;
      direction: string;
      retry?: boolean;
      time?: boolean;
    }
  ) {
    if (state) {
      this.direction = state.direction;

      if (state.type === "walk") {
        // Stop here if space is taken
        if (state.map?.isSpaceTaken(this.x, this.y, this.direction)) {
          // If behavior with retry, try to fire this function again (with npc)
          state.retry &&
            setTimeout(() => {
              this.startBehavior(state);
            }, 10);

          return;
        }

        // Ready to walk
        state.map?.moveWall(this.x, this.y, this.direction);
        this.movingProgressRemaining = 16;
        this.updateSprite();
      }
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      // Finish the walk
      update(this.playerRef, {
        position: {
          x: this.x,
          y: this.y,
        },
        direction: this.direction,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}

export default Player;
