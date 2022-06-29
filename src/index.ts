import { map, merge, pluck, scan, tap } from "rxjs";
import { keyboardArrows$ } from "./directions";
import { gameClock$ } from "./gameClock";
import { moveInGivenDirection } from "./move";
import { createRenderer } from "./render";
import { Axis, Direction, Location } from "./types";
import { isValidTurn } from "./utils";

const render = createRenderer(document.querySelector<HTMLDivElement>("#root"));

const game$ = merge(
  gameClock$.pipe(map(({ tick }) => ({ payload: tick, type: "tick" }))),
  keyboardArrows$.pipe(map((arrowKey) => ({ payload: arrowKey, type: "turn" })))
).pipe(
  scan<
    { type: string; payload: string | number },
    {
      currentDirection: { axis: Axis; direction: Direction };
      directionCandidate: { axis: Axis; direction: Direction } | null;
      snakeLocation: Location[];
    }
  >(
    (acc, action) => {
      if (action.type === "tick") {
        if (!acc.directionCandidate) {
          const nextSnakeLocation = moveInGivenDirection(
            acc.snakeLocation,
            acc.currentDirection.axis,
            acc.currentDirection.direction
          );
          return {
            ...acc,
            snakeLocation: nextSnakeLocation,
          };
        }

        const committedDirection = isValidTurn(
          acc.currentDirection,
          acc.directionCandidate
        )
          ? acc.directionCandidate
          : acc.currentDirection;

        const nextSnakeLocation = moveInGivenDirection(
          acc.snakeLocation,
          committedDirection.axis,
          committedDirection.direction
        );
        return {
          ...acc,
          currentDirection: committedDirection,
          snakeLocation: nextSnakeLocation,
          directionCandidate: null,
        };
      }

      if (action.type === "turn") {
        return {
          ...acc,
          directionCandidate: {
            axis: ["ArrowDown", "ArrowUp"].includes(action.payload as string)
              ? "y"
              : "x",
            direction: ["ArrowLeft", "ArrowUp"].includes(
              action.payload as string
            )
              ? -1
              : 1,
          },
        };
      }

      return acc;
    },
    {
      currentDirection: {
        direction: 1,
        axis: "x",
      },
      directionCandidate: null,
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
