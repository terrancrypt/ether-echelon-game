import initData from "../initData";
import { oppositeDirection } from "../utils/utils";

import GameObject from "./GameObject";
import OverworldMap from "./OverworldMap";
import Person from "./Person";
import SceneTransition from "./ScreenTransition";
import TextMessage from "./TextMessage";

export interface EventConfig {
  x?: number;
  y?: number;
  who?: string;
  type: string;
  direction?: string;
  time?: number;
  text?: string;
  faceHero?: string;
  map?: string;
}

interface OverworldEventConfig {
  map: OverworldMap;
  eventConfig: EventConfig;
}

class OverworldEvent {
  map: OverworldMap;
  event: EventConfig;

  constructor({ map, eventConfig }: OverworldEventConfig) {
    this.map = map;
    this.event = eventConfig;
  }

  stand(resolve: () => void) {
    if (this.event.who) {
      const who: Person | GameObject = this.map.gameObjects[this.event.who];

      if (who) {
        who.startBehavior({
          map: this.map,
          type: "stand",
          direction: this.event.direction as string,
          time: this.event.time,
        });

        //Set up a handler to complete when correct person is done stand with time, then resolve the event
        const completeHandler = (e: any) => {
          if (e.detail.whoId === this.event.who) {
            document.removeEventListener(
              "PersonStandComplete",
              completeHandler
            );
            resolve();
          }
        };

        document.addEventListener("PersonStandComplete", completeHandler);
      }
    }
  }

  walk(resolve: () => void) {
    if (this.event.who) {
      const who: Person | GameObject = this.map.gameObjects[this.event.who];

      if (who) {
        who.startBehavior({
          map: this.map,
          type: "walk",
          direction: this.event.direction as string,
          time: this.event.time,
          retry: true,
        });

        //Set up a handler to complete when correct person is done walking, then resolve the event
        const completeHandler = (e: any) => {
          if (e.detail.whoId === this.event.who) {
            document.removeEventListener(
              "PersonWalkingComplete",
              completeHandler
            );
            resolve();
          }
        };

        document.addEventListener("PersonWalkingComplete", completeHandler);
      }
    }
  }

  textMessage(resolve: () => void) {
    if (this.event.text) {
      if (this.event.faceHero) {
        const object = this.map.gameObjects[this.event.faceHero];
        object.direction = oppositeDirection(
          this.map.gameObjects["player"].direction
        ) as string;
      }

      const message = new TextMessage({
        text: this.event.text,
        onComplete: () => resolve(),
      });
      const container = document.querySelector(".game-online-container");
      if (container) message.init(container);
    }
  }

  changeMap(resolve: () => void) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(
      document.querySelector(".game-online-container") as HTMLElement,
      () => {
        if (this.event.map) {
          this.map.overworld?.startMap(initData[this.event.map], {
            x: this.event.x,
            y: this.event.y,
            direction: this.event.direction,
          });
          resolve();
          sceneTransition.fadeOut();
        }
      }
    );
  }

  // battle(resolve: () => void) {
  //   const battle = new Battle({
  //     onComplete: () => {
  //       resolve();
  //     },
  //   });
  //   battle.init(
  //     document.querySelector(".game-online-container") as HTMLElement
  //   );
  // }

  init(): Promise<void> {
    return new Promise((resolve) => {
      (this as any)[this.event.type](resolve);
    });
  }
}

export default OverworldEvent;
