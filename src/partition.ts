import { Axis, Location, Partition } from "./types";

export function partition(snake: Location[]) {
  let partitions: Partition[] = [];
  let prevPartition: Partition;
  let prevLocation: Location;

  const partitionError = new Error("Error partitioning a snake");

  snake.forEach((location) => {
    if (!partitions.length) {
      prevLocation = location;
      prevPartition = {
        value: [prevLocation],
      } as Partition;
      partitions.push(prevPartition);
      return;
    }

    let axis: Axis;
    let direction: -1 | 1;

    const xDiff = location.x - prevLocation.x;
    if (xDiff === 0) {
      axis = "y";
    }

    const yDiff = location.y - prevLocation.y;
    if (yDiff === 0) {
      if (axis) {
        throw partitionError;
      }

      axis = "x";
    }

    if (!axis) {
      throw partitionError;
    }

    if (axis === "y") {
      direction = yDiff > 0 ? 1 : -1;
    }

    if (axis === "x") {
      direction = xDiff > 0 ? 1 : -1;
    }

    if (!direction) {
      throw partitionError;
    }

    if (!prevPartition.axis || prevPartition.axis === axis) {
      prevPartition.axis = axis;
      prevPartition.direction = direction;
      prevPartition.value.push(location);
      prevLocation = location;
      return;
    }

    const newPartition = { axis, value: [location], direction };
    partitions.push(newPartition);
    prevPartition = newPartition;
    prevLocation = location;
  });

  return partitions;
}
