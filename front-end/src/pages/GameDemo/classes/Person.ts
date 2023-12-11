import { emitEvent } from "../utils/utils";
import GameObject, { GameObjectConfig } from "./GameObject";
import OverworldMap from "./OverworldMap";

interface StateUpdate {
  arrow?: string | undefined;
  map: OverworldMap | null;
}

interface StartBehaviorState extends StateUpdate {
  type: string;
  direction: string;
  time?: number;
  retry?: boolean;
  faceHero?: string;
}

interface PersonConfig extends GameObjectConfig {
  isPlayerControlled?: boolean;
}

class Person extends GameObject {
  private movingProgressRemaining: number;
  private directionUpdate: {
    [key: string]: [string, number];
  };
  [key: string]: any;

  constructor(config: PersonConfig) {
    super(config);
    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;

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
      if (
        !state?.map?.isCutscenePlaying &&
        this.isPlayerControlled &&
        state?.arrow
      ) {
        this.startBehavior({
          type: "walk",
          direction: state.arrow,
          map: state.map,
          arrow: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  // Behavior witt npc and sometime with player if cutscene on fire
  startBehavior(state?: StartBehaviorState) {
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

      if (state.type === "stand") {
        this.isStanding = true;
        setTimeout(() => {
          emitEvent("PersonStandComplete", this.id);
          this.isStanding = false;
        }, state.time);
      }
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      // We finished the walk!
      emitEvent("PersonWalkingComplete", this.id);
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

export default Person;
