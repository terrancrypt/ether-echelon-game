import { Boundary } from "./class/Boundary";
import { Person } from "./class/Person";
import { Sprites } from "./class/Sprites";

export const animations: Record<string, number> = {};

interface DrawOverworld {
  map: Sprites;
  player: Person;
  boundaries: Boundary[];
}

export const drawOverworld = ({
  map,
  player,
  boundaries,
}: DrawOverworld): void => {
  map.draw();
  player.draw();
  player.update();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  animations["overworld"] = requestAnimationFrame(() =>
    drawOverworld({ map, player, boundaries })
  );
};

export const draw = (
  sprites: any,
  animationId: string,
  updatePosition: boolean
): void => {
  sprites.draw();
  if (updatePosition) sprites.updatePosition();

  animations[animationId] = requestAnimationFrame(() =>
    draw(sprites, animationId, updatePosition)
  );
};

export const startAnimation = (
  sprites: any,
  animationId: string,
  updatePosition: boolean
): void => {
  if (!animations[animationId]) {
    draw(sprites, animationId, updatePosition);
  }
};

export const stopAnimation = (animationId: string): void => {
  if (animations[animationId]) {
    cancelAnimationFrame(animations[animationId]);
    delete animations[animationId];
  }
};
