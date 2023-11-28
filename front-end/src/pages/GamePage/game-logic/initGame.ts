import { charactersData } from "../../../data/charaters";
import { collisionsData } from "../../../data/collisions";
import { PlayerInfor } from "../GamePage";
import { Boundary } from "./class/Boundary";
import { Person } from "./class/Person";
import { Sprites } from "./class/Sprites";
import { drawOverworld } from "./draw";

const initGame = (canvas: HTMLCanvasElement, playerInfor: PlayerInfor) => {
  const offset = { x: -400, y: -700 };

  const overworld = new Sprites(offset.x, offset.y, "images/Overworld.png");

  const collisionsMap = [];
  for (let i = 0; i < collisionsData.length; i += 70) {
    collisionsMap.push(collisionsData.slice(i, 70 + i));
  }

  const boundaries: Boundary[] = [];
  collisionsMap.forEach((row: number[], i: number) => {
    row.forEach((symbol: number, j: number) => {
      if (symbol === 675)
        boundaries.push(new Boundary(j * 64 + offset.x, i * 64 + offset.y));
    });
  });

  const movables = [overworld, ...boundaries];

  const dataCharacter = charactersData[playerInfor.characterKey];

  const player = new Person(
    canvas.width / 2 - 192 / 4 / 2,
    canvas.height / 2 - 68 / 2,
    dataCharacter.sprites.down,
    {
      up: dataCharacter.sprites.up,
      down: dataCharacter.sprites.down,
      left: dataCharacter.sprites.left,
      right: dataCharacter.sprites.right,
    },
    movables
  );

  drawOverworld({
    map: overworld,
    player,
    boundaries,
  });
};

export default initGame;
