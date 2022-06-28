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

export type Axis = "x" | "y";

export interface Partition {
  value: Location[];
  axis: Axis;
  direction: -1 | 1;
}

// 0 - straight, 1 - right, -1 - left
export type Direction = 0 | 1 | -1;
