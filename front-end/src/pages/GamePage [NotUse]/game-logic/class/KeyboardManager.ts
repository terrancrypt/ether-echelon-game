export class KeyboardManager {
  private keys: Record<string, boolean> = {};
  lastKey: string;

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.lastKey = "";
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
    this.lastKey = e.key;
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  isKeyPressed(key: string): boolean {
    return !!this.keys[key];
  }
}
