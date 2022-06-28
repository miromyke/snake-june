import { partition } from "./partition";
import { Axis, Direction, Location } from "./types";
import { isOppositeDirections } from "./utils";

function validateSnake(snake: Location[]) {
  if (snake.length < 2) {
    throw new Error("Could not move a snake of length less than 2");
  }
}

export const moveInCurrentDirection = (snake: Location[]): Location[] => {
  validateSnake(snake);

  const partitions = partition(snake);
  const lastPartition = partitions[partitions.length - 1];
  const { axis, direction, value } = lastPartition;
  const prevHeadLocation = value[value.length - 1];
  const nextHeadLocation = {
    x: axis === "x" ? prevHeadLocation.x + direction : prevHeadLocation.x,
    y: axis === "y" ? prevHeadLocation.y + direction : prevHeadLocation.y,
  };

  const [tail, ...nextSnake] = [
    ...partitions.slice(0, partitions.length - 1),
    {
      axis,
      direction,
      value: [...value, nextHeadLocation],
    },
  ].flatMap(({ value }) => [...value]);

  return nextSnake;
};

export const moveInGivenDirection = (
  snake: Location[],
  axis: Axis,
  direction: Direction
): Location[] => {
  validateSnake(snake);

  const partitions = partition(snake);
  const headPartition = partitions[partitions.length - 1];

  if (headPartition.axis === axis) {
    if (isOppositeDirections(headPartition.direction, direction)) {
      throw new Error("Cannot move in the opposite direction");
    }

    if (headPartition.direction === direction) {
      return moveInCurrentDirection(snake);
    }
  }

  const [tail, ...nextSnake] = snake;

  const head = nextSnake[nextSnake.length - 1];

  const nextHead = {
    x: axis === "x" ? head.x + direction : head.x,
    y: axis === "y" ? head.y + direction : head.y,
  };

  return [...nextSnake, nextHead];
};
