import { Location3D, Axis, Direction } from "./types";

const isOverreach = (
  head: Location3D,
  direction: { axis: Axis; direction: Direction },
  mapSize: number
): boolean => {
  if (head.face === "front") {
    if (direction.axis === "x") {
      const diffX = head.x + direction.direction;
      if (diffX > mapSize - 2 || diffX < 0) {
        return true;
      }
    }

    if (direction.axis === "y") {
      const diffY = head.y + direction.direction;
      if (diffY > mapSize - 2 || diffY < 0) {
        return true;
      }
    }
  }

  return false;
};

export const moveSnake = (
  snake: Location3D[],
  nextDirection: {
    axis: Axis;
    direction: Direction;
  },
  mapSize: number
): Location3D[] => {
  const [tail, ...nextSnake] = snake;

  const head = nextSnake[nextSnake.length - 1];

  if (!isOverreach(head, nextDirection, mapSize)) {
    let nextHead: Location3D;

    if (nextDirection.axis === "x") {
      nextHead = {
        x: head.x + nextDirection.direction,
        y: head.y,
        face: head.face,
      };
    }

    if (nextDirection.axis === "y") {
      nextHead = {
        x: head.x,
        y: head.y + nextDirection.direction,
        face: head.face,
      };
    }

    return [...nextSnake, nextHead];
  }

  if (head.face === "front") {
    if (nextDirection.axis === "x") {
      const diffX = head.x + nextDirection.direction;

      if (diffX > mapSize - 2) {
        // overreach to the right
        return [...nextSnake, { x: 0, y: head.y, face: "right" }];
      }

      if (diffX < 0) {
        // overreach to the left
        return [...nextSnake, { x: mapSize - 1, y: head.y, face: "left" }];
      }
    }

    if (nextDirection.axis === "y") {
      const diffY = head.y + nextDirection.direction;

      if (diffY < 0) {
        return [...nextSnake, { x: head.x, y: mapSize - 1, face: "top" }];
      }

      if (diffY > mapSize - 2) {
        // overreach to the left
        return [...nextSnake, { x: head.x, y: 0, face: "bottom" }];
      }
    }
  }

  return snake;
};

const directions = {
  front: {
    right: "right",
    left: "left",
    top: "top",
    bottom: "bottom",
  },
  top: {
    right: "right",
    left: "left",
    top: "back",
    bottom: "front",
  },
  back: {
    right: "right",
    left: "left",
    top: "bottom",
    bottom: "top",
  },
  bottom: {
    right: "right",
    left: "left",
    top: "bottom",
    bottom: "top",
  },
};
