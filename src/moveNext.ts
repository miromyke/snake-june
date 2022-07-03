import { Location3D, Axis, Direction } from "./types";

const isOverreach = (
  head: Location3D,
  direction: { axis: Axis; direction: Direction },
  mapSize: number
): boolean => {
  if (direction.axis === "x") {
    const nextX = head.x + direction.direction;
    if (nextX >= mapSize || nextX < 0) {
      return true;
    }
  }

  if (direction.axis === "y") {
    const nextY = head.y + direction.direction;
    if (nextY >= mapSize || nextY < 0) {
      return true;
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
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        // overreach to the right
        return [...nextSnake, { x: 0, y: head.y, face: "right" }];
      }

      if (nextX < 0) {
        // overreach to the left
        return [...nextSnake, { x: mapSize - 1, y: head.y, face: "left" }];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [...nextSnake, { x: head.x, y: mapSize - 1, face: "top" }];
      }

      if (nextY >= mapSize) {
        // overreach to the left
        return [...nextSnake, { x: head.x, y: 0, face: "bottom" }];
      }
    }
  }

  if (head.face === "back") {
    if (nextDirection.axis === "x") {
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        // overreach to the right
        return [...nextSnake, { x: 0, y: head.y, face: "right" }];
      }

      if (nextX < 0) {
        // overreach to the left
        return [...nextSnake, { x: mapSize - 1, y: head.y, face: "left" }];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [...nextSnake, { x: head.x, y: mapSize - 1, face: "top" }];
      }

      if (nextY >= mapSize) {
        // overreach to the left
        return [...nextSnake, { x: head.x, y: 0, face: "bottom" }];
      }
    }
  }

  if (head.face === "top") {
    if (nextDirection.axis === "x") {
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        // overreach to the right
        return [...nextSnake, { x: mapSize - 1 - head.y, y: 0, face: "right" }];
      }

      if (nextX < 0) {
        // overreach to the left
        return [...nextSnake, { x: head.y, y: 0, face: "left" }];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [...nextSnake, { x: mapSize - head.x + 1, y: 0, face: "back" }];
      }

      if (nextY >= mapSize) {
        // overreach to the left
        return [...nextSnake, { x: head.x, y: 0, face: "front" }];
      }
    }
  }

  if (head.face === "right") {
    if (nextDirection.axis === "x") {
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        // overreach to the right
        return [...nextSnake, { x: 0, y: head.y, face: "back" }];
      }

      if (nextX < 0) {
        // overreach to the left
        return [...nextSnake, { y: head.y, x: mapSize - 1, face: "front" }];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [
          ...nextSnake,
          { x: mapSize - 1, y: mapSize - head.x - 1, face: "top" },
        ];
      }

      if (nextY >= mapSize) {
        // overreach to the left
        return [...nextSnake, { x: head.x, y: 0, face: "bottom" }];
      }
    }
  }

  if (head.face === "left") {
    if (nextDirection.axis === "x") {
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        return [...nextSnake, { x: 0, y: head.y, face: "front" }];
      }

      if (nextX < 0) {
        return [...nextSnake, { y: head.y, x: mapSize - 1, face: "back" }];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [...nextSnake, { x: 0, y: head.x, face: "top" }];
      }

      if (nextY >= mapSize) {
        return [
          ...nextSnake,
          { x: 0, y: mapSize - 1 - head.x, face: "bottom" },
        ];
      }
    }
  }

  if (head.face === "bottom") {
    if (nextDirection.axis === "x") {
      const nextX = head.x + nextDirection.direction;

      if (nextX >= mapSize) {
        return [...nextSnake, { x: head.y, y: mapSize - 1, face: "right" }];
      }

      if (nextX < 0) {
        return [
          ...nextSnake,
          { y: mapSize - 1, x: mapSize - 1 - head.y, face: "left" },
        ];
      }
    }

    if (nextDirection.axis === "y") {
      const nextY = head.y + nextDirection.direction;

      if (nextY < 0) {
        return [...nextSnake, { x: head.x, y: mapSize - 1, face: "front" }];
      }

      if (nextY >= mapSize) {
        return [
          ...nextSnake,
          { x: mapSize - 1 - head.x, y: mapSize - 1, face: "back" },
        ];
      }
    }
  }

  return snake;
};
