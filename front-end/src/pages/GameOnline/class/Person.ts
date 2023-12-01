import GameObject, { GameObjectConfig } from "./GameObject";

class Person extends GameObject {
  private movingProgressRemaining: number;
  private directionUpdate: {
    [key: string]: [string, number];
  };
  [key: string]: any;

  constructor(config: GameObjectConfig & { isPlayerControlled?: boolean }) {
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

  update(state?: { arrow: string | undefined }): void {
    this.updatePosition();
    this.updateSprite(state);

    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      state?.arrow
    ) {
      this.direction = state.arrow;
      this.movingProgressRemaining = 16;
    }
  }

  updatePosition() {
    if (this.movingProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;
    }
  }

  updateSprite(state?: { arrow: string | undefined }) {
    if (
      this.isPlayerControlled &&
      this.movingProgressRemaining === 0 &&
      !state?.arrow
    ) {
      this.sprite.setAnimation("idle-" + this.direction);
      return;
    }

    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
    }
  }
}

export default Person;