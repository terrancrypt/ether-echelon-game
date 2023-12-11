import OverworldEvent, { EventConfig } from "./OverworldEvent";
import OverworldMap from "./OverworldMap";
import Sprite from "./Sprite";

export interface GameObjectConfig {
  x: number;
  y: number;
  src: string;
  direction?: "up" | "down" | "left" | "right";
  behaviorLoop?: EventConfig[];
  talking?: {
    [key: string]: EventConfig[];
  }[];
  cutsceneSpaces?: {
    [key: string]: {
      events: EventConfig[];
    }[];
  };
}

class GameObject {
  id: string | null;
  isMounted: boolean;
  x: number;
  y: number;
  sprite: Sprite;
  direction: string;

  // Behavior
  behaviorLoop?: EventConfig[];
  behaviorLoopIndex: number;
  isStanding: boolean;
  talking?: {
    [key: string]: EventConfig[];
  }[];

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
    this.isStanding = false;
    this.talking = config.talking;
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

  startBehavior() {}

  async doBehaviorEvent(map: OverworldMap) {
    // Don't do anything if there is a mor important cutscene or don't have any behavior
    if (
      map.isCutscenePlaying ||
      this.behaviorLoop?.length === 0 ||
      this.isStanding
    ) {
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
