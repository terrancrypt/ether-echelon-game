import OverworldMap from "./OverworldMap";

interface OverworldEventConfig {
  map: OverworldMap;
  eventConfig: {
    type: string;
    direction: string;
    time?: number;
    who?: string;
  };
}

class OverworldEvent {
  map: OverworldMap;
  event: { type: string; direction: string; time?: number; who?: string };

  constructor({ map, eventConfig }: OverworldEventConfig) {
    this.map = map;
    this.event = eventConfig;
  }

  stand(resolve: () => void) {}

  walk(resolve: () => void) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      (this as any)[this.event.type](resolve);
    });
  }
}

export default OverworldEvent;
