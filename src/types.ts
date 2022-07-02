export interface State {
  meshSize: [number, number];
  /**
   * @descrition head - first child, tail - last child
   */
  snakeLocation: Location[];
  foodLocation: Location[];
  direction: "top" | "bottom" | "left" | "right";
  isGameLost: boolean;
}

export type Location = { x: number; y: number };

export type Location3D = Location & { face: string };

export type Face = "top" | "bottom" | "right" | "left" | "front" | "back";

export type Axis = "x" | "y";

export interface Partition {
  value: Location[];
  axis: Axis;
  direction: Direction;
}

export type Direction = 1 | -1;
