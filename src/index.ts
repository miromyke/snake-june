import { map, merge, pluck, scan, tap } from "rxjs";
import { keyboardArrows$ } from "./directions";
import { gameClock$ } from "./gameClock";
import { moveInGivenDirection } from "./move";
import { createRenderer } from "./render";
import { Axis, Direction, Location } from "./types";
import { isValidTurn } from "./utils";

const render = createRenderer(document.querySelector<HTMLDivElement>("#root"));

const arrowKeyToDirection = (
  key: string
): { axis: Axis; direction: Direction } => ({
  axis: ["ArrowDown", "ArrowUp"].includes(key) ? "y" : "x",
  direction: ["ArrowLeft", "ArrowUp"].includes(key) ? -1 : 1,
});

const game$ = merge(
  gameClock$.pipe(map(({ tick }) => ({ payload: tick, type: "tick" }))),
  keyboardArrows$.pipe(map((arrowKey) => ({ payload: arrowKey, type: "turn" })))
).pipe(
  scan<
    { type: string; payload: string | number },
    {
      prevDirection: { axis: Axis; direction: Direction } | null;
      directionQueue: { axis: Axis; direction: Direction }[];
      snakeLocation: Location[];
    }
  >(
    (acc, action) => {
      if (action.type === "tick") {
        const [nextDirection, ...nextDirectionQueue] = acc.directionQueue;

        if (!nextDirection) {
          const nextSnakeLocation = moveInGivenDirection(
            acc.snakeLocation,
            acc.prevDirection.axis,
            acc.prevDirection.direction
          );
          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
          };
        }

        if (!isValidTurn(acc.prevDirection, nextDirection)) {
          const nextSnakeLocation = moveInGivenDirection(
            acc.snakeLocation,
            acc.prevDirection.axis,
            acc.prevDirection.direction
          );
          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
            directionQueue: [],
          };
        }

        const nextSnakeLocation = moveInGivenDirection(
          acc.snakeLocation,
          nextDirection.axis,
          nextDirection.direction
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
          directionQueue:
            acc.directionQueue.length < 3
              ? [
                  ...acc.directionQueue,
                  arrowKeyToDirection(action.payload as string),
                ]
              : acc.directionQueue,
        };
      }

      return acc;
    },
    {
      prevDirection: {
        direction: 1,
        axis: "x",
      },
      directionQueue: [],
      snakeLocation: [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
        { x: 13, y: 10 },
        { x: 14, y: 10 },
      ],
    }
  ),
  pluck("snakeLocation"),
  tap(render)
);

game$.subscribe();
