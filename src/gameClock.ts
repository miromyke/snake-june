import {
  merge,
  filter,
  fromEvent,
  interval,
  map,
  of,
  scan,
  startWith,
  switchMap,
  share,
  tap,
  distinctUntilChanged,
} from "rxjs";

const isPausedByDefault = true;

export const pauses$ = fromEvent(document, "keydown").pipe(
  filter((e: KeyboardEvent) => e.code === "Space"),
  tap((e) => e.preventDefault()),
  scan((prevState) => ({ pause: !prevState.pause }), {
    pause: isPausedByDefault,
  }),
  share(),
  startWith({ pause: isPausedByDefault })
);

const clockSpeed$ = merge(
  fromEvent(document, "keydown").pipe(
    filter((e: KeyboardEvent) => e.code === "ShiftLeft"),
    map(() => "keydown")
  ),
  fromEvent(document, "keyup").pipe(
    filter((e: KeyboardEvent) => e.code === "ShiftLeft"),
    map(() => "keyup")
  )
).pipe(
  map((key) => {
    if (key === "keyup") {
      return { clockSpeed: 150 };
    }

    if (key === "keydown") {
      return { clockSpeed: 150 };
    }
  }),
  startWith({ clockSpeed: 150 })
);

export const gameClock$ = merge(pauses$, clockSpeed$).pipe(
  scan((acc, next) => ({ ...acc, ...next }), { pause: false, clockSpeed: 0 }),
  switchMap(({ pause, clockSpeed }) => {
    if (pause) {
      return of({ pause: true, shouldTick: false });
    }

    return merge(
      interval(clockSpeed).pipe(map(() => ({ pause: false, shouldTick: true })))
    );
  }),
  scan(
    ({ tick }, { pause, shouldTick }) => ({
      pause,
      tick: shouldTick ? tick + 1 : tick,
    }),
    {
      tick: 0,
    }
  ),
  distinctUntilChanged(
    (prevState, nextState) => prevState.tick === nextState.tick
  ),
  share()
);
