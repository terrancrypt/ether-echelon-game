import professorHourseCollisions from "../../assets/maps/ProfessorHouse/collisionsData";
import collisionsTownData from "../../assets/maps/Town/collisionsData";
import collisionsTown2Data from "../../assets/maps/Town2/conlisionsData";
import { OverworldMapsData } from "./classes/Overworld";
import Person from "./classes/Person";
import { asGridCoord, getCollisionsData, withGrid } from "./utils/utils";

const initData: OverworldMapsData = {
  ProfessorHouse: {
    lowerSrc: "src/assets/maps/ProfessorHouse/ProfessorHouse.png",
    upperSrc: "src/assets/maps/ProfessorHouse/UpperProfessorHouse.png",
    gameObjects: {
      npcA: new Person({
        x: withGrid(2),
        y: withGrid(12),
        src: "images/Characters/LumberJack/LumberJackSpriteSheet.png",
        behaviorLoop: [
          { type: "stand", direction: "down", time: 10000 },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "right", time: 800 },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "I'm busy...",
                faceHero: "npcA",
              },
              { type: "textMessage", text: "Go away!" },
            ],
          },
        ],
      }),
      professorNPC: new Person({
        x: withGrid(10),
        y: withGrid(5),
        src: "images/Characters/Professor/ProfessorSpriteSheet.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 2000 },
          { type: "stand", direction: "down", time: 2000 },
        ],
      }),
    },
    walls: getCollisionsData(professorHourseCollisions, 16, 122),
    cutsceneSpaces: {
      [asGridCoord(13, 3)]: [
        {
          events: [
            {
              who: "professorNPC",
              type: "walk",
              direction: "up",
            },
            {
              who: "professorNPC",
              type: "walk",
              direction: "up",
            },
            {
              who: "professorNPC",
              type: "walk",
              direction: "right",
            },
            {
              who: "player",
              type: "walk",
              direction: "left",
            },
            {
              who: "professorNPC",
              type: "stand",
              direction: "right",
              time: 800,
            },
            {
              who: "professorNPC",
              type: "textMessage",
              text: "You can't go upstairs!",
            },
            {
              who: "professorNPC",
              type: "walk",
              direction: "left",
            },
            {
              who: "professorNPC",
              type: "walk",
              direction: "down",
            },
            {
              who: "professorNPC",
              type: "walk",
              direction: "down",
            },
            {
              who: "player",
              type: "walk",
              direction: "left",
            },
            {
              who: "player",
              type: "walk",
              direction: "left",
            },
          ],
        },
      ],
      [asGridCoord(10, 14)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town",
              x: withGrid(11),
              y: withGrid(13),
              direction: "down",
            },
          ],
        },
      ],
      [asGridCoord(11, 14)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town",
              x: withGrid(11),
              y: withGrid(13),
              direction: "down",
            },
          ],
        },
      ],
    },
  },
  Town: {
    lowerSrc: "src/assets/maps/Town/Town.png",
    upperSrc: "src/assets/maps/Town/UpperTown.png",
    gameObjects: {},
    walls: getCollisionsData(collisionsTownData, 31, 42),
    cutsceneSpaces: {
      [asGridCoord(11, 13)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "ProfessorHouse",
              x: withGrid(10),
              y: withGrid(14),
              direction: "down",
            },
          ],
        },
      ],
    },
  },
  Town2: {
    lowerSrc: "src/assets/maps/Town2/Town2.png",
    upperSrc: "src/assets/maps/Town2/UpperTown2.png",
    gameObjects: {},
    walls: getCollisionsData(collisionsTown2Data, 52, 2402),
  },
};
export default initData;
