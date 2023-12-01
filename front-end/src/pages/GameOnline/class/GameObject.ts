import OverworldEvent from "./OverworldEvent";
import OverworldMap from "./OverworldMap";
import Sprite from "./Sprite";

export interface GameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: "up" | "down" | "left" | "right";
  behaviorLoop?: {
    type: string;
    direction: string;
    time?: number;
  }[];
}

class GameObject {
  id: string | null;
  isMounted: boolean;
  x: number;
  y: number;
  sprite: Sprite;
  direction: string;

  // Behavior
  behaviorLoop?: {
    type: string;
    direction: string;
    time?: number;
    who?: string; // game object id
  }[];
  behaviorLoopIndex: number;

  constructor(config: GameObjectConfig) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x;
    this.y = config.y;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src,
    });

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }

  mount(map: OverworldMap) {
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // If we have a behavior, kick off after a short deplay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update() {}

  async doBehaviorEvent(map: OverworldMap) {
    // Don't do anything if there is a mor important cutscene or don't have any behavior
    if (map.isCutscenePlaying && this.behaviorLoop != undefined) {
      return;
    }
    // Setting up the event
    if (this.behaviorLoop != null) {
      let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
      eventConfig.who = this.id as string;

      // Create an event intance
      const eventHandler = new OverworldEvent({ map, eventConfig });
      await eventHandler.init();

      // Setting the next event to fire
      this.behaviorLoopIndex += 1;
      if (this.behaviorLoopIndex === this.behaviorLoop.length) {
        this.behaviorLoopIndex = 0;
      }

      // Do it again
      this.doBehaviorEvent(map);
    }
  }
}

export default GameObject;
