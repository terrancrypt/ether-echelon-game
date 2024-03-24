import professorHouseCollisions from "../../assets/collisionsData/professorHouseCollisions/collisionsData";
import collisionsTownData from "../../assets/collisionsData/town/collisionsData";
import collisionsTown2Data from "../../assets/collisionsData/town2/conlisionsData";
import { OverworldMapsData } from "./classes/Overworld";
import Person from "./classes/Person";
import { asGridCoord, getCollisionsData, withGrid } from "./utils/utils";

const initData: OverworldMapsData = {
  ProfessorHouse: {
    lowerSrc: "/images/maps/ProfessorHouse/ProfessorHouse.png",
    upperSrc: "/images/maps/ProfessorHouse/UpperProfessorHouse.png",
    gameObjects: {
      npcA: new Person({
        x: withGrid(2),
        y: withGrid(12),
        src: "/images/characters/LumberJack/LumberJackSpriteSheet.png",
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
        src: "/images/characters/Professor/ProfessorSpriteSheet.png",
        behaviorLoop: [
          { type: "stand", direction: "left", time: 2000 },
          { type: "stand", direction: "down", time: 2000 },
        ],
      }),
    },
    walls: getCollisionsData(professorHouseCollisions, 16, 122),
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
    lowerSrc: "/images/maps/Town/Town.png",
    upperSrc: "/images/maps/Town/UpperTown.png",
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
      [asGridCoord(17, 2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town2",
              x: withGrid(24),
              y: withGrid(49),
              direction: "up",
            },
          ],
        },
      ],
      [asGridCoord(18, 2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town2",
              x: withGrid(24),
              y: withGrid(49),
              direction: "up",
            },
          ],
        },
      ],
      [asGridCoord(19, 2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town2",
              x: withGrid(24),
              y: withGrid(49),
              direction: "up",
            },
          ],
        },
      ],
      [asGridCoord(20, 2)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town2",
              x: withGrid(24),
              y: withGrid(49),
              direction: "up",
            },
          ],
        },
      ],
    },
  },
  Town2: {
    lowerSrc: "/images/maps/Town2/Town2.png",
    upperSrc: "/images/maps/Town2/UpperTown2.png",
    gameObjects: {},
    walls: getCollisionsData(collisionsTown2Data, 52, 2402),
    cutsceneSpaces: {
      [asGridCoord(24, 49)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town",
              x: withGrid(18),
              y: withGrid(2),
              direction: "down",
            },
          ],
        },
      ],
      [asGridCoord(25, 49)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town",
              x: withGrid(18),
              y: withGrid(2),
              direction: "down",
            },
          ],
        },
      ],
      [asGridCoord(26, 49)]: [
        {
          events: [
            {
              type: "changeMap",
              map: "Town",
              x: withGrid(18),
              y: withGrid(2),
              direction: "down",
            },
          ],
        },
      ],
    },
  },
};
export default initData;
