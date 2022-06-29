import {
  distinctUntilChanged,
  filter,
  fromEvent,
  pluck,
  scan,
  startWith,
  tap,
} from "rxjs";
import { Axis, Direction } from "./types";

const keyboardArrows$ = fromEvent(document, "keydown").pipe(
  filter((e: KeyboardEvent) =>
    ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
  ),
  tap((e) => e.preventDefault()),
  pluck("key")
);

export const directions$ = keyboardArrows$.pipe(
  scan(
    (prevState, key) => {
      if (
        key === "ArrowDown" &&
        prevState.direction === -1 &&
        prevState.axis === "y"
      ) {
        return prevState;
      }

      if (
        key === "ArrowUp" &&
        prevState.direction === 1 &&
        prevState.axis === "y"
      ) {
        return prevState;
      }

      if (
        key === "ArrowLeft" &&
        prevState.direction === 1 &&
        prevState.axis === "x"
      ) {
        return prevState;
      }

      if (
        key === "ArrowRight" &&
        prevState.direction === -1 &&
        prevState.axis === "x"
      ) {
        return prevState;
      }

      return {
        direction: ["ArrowDown", "ArrowRight"].includes(key) ? 1 : -1,
        axis: ["ArrowDown", "ArrowUp"].includes(key) ? "y" : "x",
      };
    },
    { direction: 1, axis: "x" }
  ),
  startWith<{ axis: Axis; direction: Direction }>({ direction: 1, axis: "x" }),
  distinctUntilChanged(
    (prevState, nextState) =>
      prevState.axis === nextState.axis &&
      prevState.direction === nextState.direction
  )
);
