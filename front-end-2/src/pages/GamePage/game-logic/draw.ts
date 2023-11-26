export const animations: Record<string, number> = {};

export const draw = (
  sprites: any,
  animationId: string,
  updatePosition: boolean,
  isPerson: boolean
): void => {
  sprites.draw();
  if (updatePosition) sprites.updatePosition();
  if (isPerson) sprites.update();

  animations[animationId] = requestAnimationFrame(() =>
    draw(sprites, animationId, updatePosition, isPerson)
  );
};

export const startAnimation = (
  sprites: any,
  animationId: string,
  updatePosition: boolean,
  isPerson: boolean
): void => {
  if (!animations[animationId]) {
    draw(sprites, animationId, updatePosition, isPerson);
  }
};

export const stopAnimation = (animationId: string): void => {
  if (animations[animationId]) {
    cancelAnimationFrame(animations[animationId]);
    delete animations[animationId];
  }
};
