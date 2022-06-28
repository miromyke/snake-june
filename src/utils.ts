import { Axis, Direction } from "./types";

export const isOppositeAxes = (axisA: Axis, axisB: Axis) => {
  if (axisA !== "x" && axisA !== "y") {
    throw new Error(`unknown axis ${axisA}`);
  }

  if (axisB !== "x" && axisB !== "y") {
    throw new Error(`unknown axis ${axisB}`);
  }

  return axisA !== axisB;
};

export const isOppositeDirections = (dir1: Direction, dir2: Direction) => {
  if (dir1 !== 1 && dir1 !== -1) {
    throw new Error(`unknown direction ${dir1}`);
  }

  if (dir2 !== 1 && dir2 !== -1) {
    throw new Error(`unknown direction ${dir2}`);
  }

  return dir1 !== dir2;
};
