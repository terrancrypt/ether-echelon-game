function withGrid(n: number) {
  return n * 16;
}

function asGridCoord(x: number, y: number) {
  return `${x * 16},${y * 16}`;
}

function nextPosition(initialX: number, initialY: number, direction: string) {
  let x = initialX;
  let y = initialY;
  const size = 16;
  if (direction === "left") {
    x -= size;
  } else if (direction === "right") {
    x += size;
  } else if (direction === "up") {
    y -= size;
  } else if (direction === "down") {
    y += size;
  }
  return { x, y };
}

function emitEvent(eventName: string, personId: string | null) {
  if (personId) {
    const event = new CustomEvent(eventName, {
      detail: {
        whoId: personId,
      },
    });
    document.dispatchEvent(event);
  }
}

function oppositeDirection(direction: string): string | undefined {
  if (direction === "left") return "right";
  if (direction === "right") return "left";
  if (direction === "up") return "down";
  if (direction === "down") return "up";
}

function getCollisionsData(
  mapData: number[],
  widthTiles: number,
  symbolNumber: number
) {
  const collisionMap = [];
  for (let i = 0; i < mapData.length; i += widthTiles) {
    collisionMap.push(mapData.slice(i, widthTiles + i));
  }

  const walls: any = {};
  collisionMap.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === symbolNumber) {
        walls[asGridCoord(x, y)] = true;
      }
    });
  });

  return walls;
}

export {
  withGrid,
  asGridCoord,
  nextPosition,
  emitEvent,
  oppositeDirection,
  getCollisionsData,
};
