import { map, merge, pluck, scan, tap } from "rxjs";
import { keyboardArrows$ } from "./directions";
import { gameClock$ } from "./gameClock";
import { moveSnake } from "./moveNext";
import { createRenderer } from "./render";
import { Axis, Direction, Location3D } from "./types";
import { isValidTurn } from "./utils";

const meshSize = 25;
const render = createRenderer(25);

const arrowKeyToDirection = (
  key: string
): { axis: Axis; direction: Direction } => ({
  axis: ["ArrowDown", "ArrowUp"].includes(key) ? "y" : "x",
  direction: ["ArrowLeft", "ArrowUp"].includes(key) ? -1 : 1,
});

const getDirectionQueue = (
  directionQueue: { axis: Axis; direction: Direction }[],
  key: string
) => {
  return directionQueue.length < 3
    ? [...directionQueue, arrowKeyToDirection(key as string)]
    : directionQueue;
};

const game$ = merge(
  gameClock$.pipe(map(({ tick }) => ({ payload: tick, type: "tick" }))),
  keyboardArrows$.pipe(map((arrowKey) => ({ payload: arrowKey, type: "turn" })))
).pipe(
  scan<
    { type: string; payload: string | number },
    {
      prevDirection: { axis: Axis; direction: Direction } | null;
      directionQueue: { axis: Axis; direction: Direction }[];
      snakeLocation: Location3D[];
    }
  >(
    (acc, action) => {
      if (action.type === "tick") {
        const [nextDirection, ...nextDirectionQueue] = acc.directionQueue;

        if (!nextDirection) {
          const nextSnakeLocation = moveSnake(
            acc.snakeLocation,
            acc.prevDirection,
            meshSize
          );
          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
          };
        }

        if (!isValidTurn(acc.prevDirection, nextDirection)) {
          const nextSnakeLocation = moveSnake(
            acc.snakeLocation,
            acc.prevDirection,
            meshSize
          );
          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
            directionQueue: [],
          };
        }

        const nextSnakeLocation = moveSnake(
          acc.snakeLocation,
          nextDirection,
          meshSize
        );

        return {
          ...acc,
          snakeLocation: nextSnakeLocation,
          prevDirection: nextDirection,
          directionQueue: nextDirectionQueue,
        };
      }

      if (action.type === "turn") {
        return {
          ...acc,
          directionQueue: getDirectionQueue(
            acc.directionQueue,
            action.payload as string
          ),
        };
      }

      return acc;
    },
    {
      prevDirection: {
        direction: -1,
        axis: "y",
      },
      directionQueue: [],
      snakeLocation: [
        { x: 1, y: 3, face: "front" },
        { x: 1, y: 4, face: "front" },
        { x: 1, y: 5, face: "front" },
        { x: 1, y: 6, face: "front" },
      ],
    }
  ),
  pluck("snakeLocation"),
  tap(render)
);

game$.subscribe();
