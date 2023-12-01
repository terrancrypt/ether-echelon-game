import GameObject, { GameObjectConfig } from "./GameObject";
import OverworldMap from "./OverworldMap";

interface StateUpdate {
  arrow: string | undefined;
  map: OverworldMap | null;
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
      if (this.isPlayerControlled && state?.arrow) {
        // More cases for starting to walk

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

  startBehavior(
    state: StateUpdate & {
      type: string;
      direction: string;
    }
  ) {
    this.direction = state.direction;
    if (state.map?.isSpaceTaken(this.x, this.y, this.direction)) {
      // Stop here if space is taken
      return;
    }

    // Ready to walk
    state.map?.moveWall(this.x, this.y, this.direction);
    this.movingProgressRemaining = 16;
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
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
