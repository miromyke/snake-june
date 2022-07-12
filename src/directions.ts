import { filter, fromEvent, pluck, scan, tap, merge, map } from "rxjs";
import { pauses$ } from "./gameClock";

export const getKeyboardControls = (
  keyboardMapping: Record<string, string>
) => {
  return merge(
    fromEvent(document, "keydown").pipe(
      filter((e: KeyboardEvent) =>
        Object.keys(keyboardMapping).includes(e.key)
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
    filter(({ pause, key }) => !pause && !!key),
    pluck("key"),
    map((key) => keyboardMapping[key])
  );
};
