import {
  distinctUntilChanged,
  filter,
  fromEvent,
  pluck,
  scan,
  tap,
  merge,
  map,
} from "rxjs";
import { pauses$ } from "./gameClock";

export const keyboardArrows$ = merge(
  fromEvent(document, "keydown").pipe(
    filter((e: KeyboardEvent) =>
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
    ),
    tap((e) => e.preventDefault()),
    map((e) => ({ key: e.key }))
  ),
  pauses$
).pipe(
  scan(
    (prev, next) => {
      return { ...prev, ...next };
    },
    { pause: null, key: null }
  ),
  distinctUntilChanged((prev, next) => prev.key === next.key),
  filter(({ pause }) => !pause),
  pluck("key")
);
