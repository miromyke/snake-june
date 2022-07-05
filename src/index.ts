import { map, merge, pluck, scan, tap } from "rxjs";
import { keyboardArrows$ } from "./directions";
import { gameClock$ } from "./gameClock";
import { moveSnake } from "./moveNext";
import { createRenderer } from "./render";
import { Axis, Direction, Location3D } from "./types";
import { canMoveNext } from "./utils";

const meshSize = 25;
const render = createRenderer(25);

const arrowKeyToDirection = (
  key: string
): { axis: Axis; direction: Direction } => ({
  axis: ["ArrowDown", "ArrowUp"].includes(key) ? "y" : "x",
  direction: ["ArrowLeft", "ArrowUp"].includes(key) ? -1 : 1,
});

const shiftDirectionQueue = (
  directionQueue: { axis: Axis; direction: Direction }[],
  key: string
) => {
  return directionQueue.length < 3
    ? [...directionQueue, arrowKeyToDirection(key as string)]
    : directionQueue;
};

const getAdjustedDirection = (
  snake: Location3D[]
): [boolean, { axis: Axis; direction: Direction } | null] => {
  const [prevHead, nextHead] = snake.slice(-2);

  if (prevHead.face === "top" && nextHead.face === "back") {
    return [true, { direction: 1, axis: "y" }];
  }
  if (prevHead.face === "back" && nextHead.face === "top") {
    return [true, { direction: 1, axis: "y" }];
  }

  if (prevHead.face === "top" && nextHead.face === "left") {
    return [true, { direction: 1, axis: "y" }];
  }

  if (prevHead.face === "left" && nextHead.face === "top") {
    return [true, { direction: 1, axis: "x" }];
  }

  if (prevHead.face === "top" && nextHead.face === "right") {
    return [true, { direction: 1, axis: "y" }];
  }
  if (prevHead.face === "right" && nextHead.face === "top") {
    return [true, { direction: -1, axis: "x" }];
  }

  if (prevHead.face === "right" && nextHead.face === "bottom") {
    return [true, { direction: -1, axis: "x" }];
  }
  if (prevHead.face === "bottom" && nextHead.face === "right") {
    return [true, { direction: -1, axis: "y" }];
  }

  if (prevHead.face === "bottom" && nextHead.face === "left") {
    return [true, { direction: -1, axis: "y" }];
  }
  if (prevHead.face === "left" && nextHead.face === "bottom") {
    return [true, { direction: 1, axis: "x" }];
  }

  if (prevHead.face === "back" && nextHead.face === "bottom") {
    return [true, { direction: -1, axis: "y" }];
  }

  if (prevHead.face === "bottom" && nextHead.face === "back") {
    return [true, { direction: -1, axis: "y" }];
  }

  return [false, null];
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
          const [shouldAdjustDirection, nextDirection] =
            getAdjustedDirection(nextSnakeLocation);

          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
            prevDirection: shouldAdjustDirection
              ? nextDirection
              : acc.prevDirection,
          };
        }

        const allowMoveNext = canMoveNext(acc.prevDirection, nextDirection);

        if (!allowMoveNext) {
          const nextSnakeLocation = moveSnake(
            acc.snakeLocation,
            acc.prevDirection,
            meshSize
          );
          const [shouldAdjustDirection, nextDirection] =
            getAdjustedDirection(nextSnakeLocation);
          return {
            ...acc,
            prevDirection: shouldAdjustDirection
              ? nextDirection
              : acc.prevDirection,
            snakeLocation: nextSnakeLocation,
            directionQueue: [],
          };
        }

        const nextSnakeLocation = moveSnake(
          acc.snakeLocation,
          nextDirection,
          meshSize
        );
        const [shouldAdjustNextDirection, nextDirectionAdjusted] =
          getAdjustedDirection(nextSnakeLocation);

        return {
          ...acc,
          snakeLocation: nextSnakeLocation,
          prevDirection: shouldAdjustNextDirection
            ? nextDirectionAdjusted
            : nextDirection,
          directionQueue: nextDirectionQueue,
        };
      }

      if (action.type === "turn") {
        const nextDirectionQueue = shiftDirectionQueue(
          acc.directionQueue,
          action.payload as string
        );
        return {
          ...acc,
          directionQueue: nextDirectionQueue,
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
        { x: 1, y: 11, face: "back" },
        { x: 1, y: 10, face: "back" },
        { x: 1, y: 9, face: "back" },
        { x: 1, y: 8, face: "back" },
        { x: 1, y: 7, face: "back" },
        { x: 1, y: 6, face: "back" },
      ],
    }
  ),
  tap(console.log),
  pluck("snakeLocation"),
  tap(render)
);

game$.subscribe();
