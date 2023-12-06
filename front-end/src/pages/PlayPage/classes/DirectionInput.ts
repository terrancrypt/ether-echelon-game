class DirectionInput {
  heldDirections: string[];
  mapKey: { [key: string]: string };

  constructor() {
    this.heldDirections = [];
    this.mapKey = {
      ArrowUp: "up",
      KeyW: "up",
      ArrowDown: "down",
      KeyS: "down",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      const dir = this.mapKey[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      const dir = this.mapKey[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}

export default DirectionInput;
