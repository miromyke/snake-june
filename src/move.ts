import { partition } from "./partition";
import { Location } from "./types";

export const move = (snake: Location[]): Location[] => {
  if (snake.length < 2) {
    throw new Error("Could not move a snake of length less than 2");
  }

  const partitions = partition(snake);
  const lastPartition = partitions[partitions.length - 1];
  const { axis, direction, value } = lastPartition;
  const prevHeadLocation = value[value.length - 1];
  const nextHeadLocation = {
    x: axis === "x" ? prevHeadLocation.x + direction : prevHeadLocation.x,
    y: axis === "y" ? prevHeadLocation.y + direction : prevHeadLocation.y,
  };

  const [first, ...nextSnake] = [
    ...partitions.slice(0, partitions.length - 1),
    {
      axis,
      direction,
      value: [...value, nextHeadLocation],
    },
  ].flatMap(({ value }) => [...value]);

  return nextSnake;
};
