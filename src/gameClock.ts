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
const clockSpeed = 300;

export const pauses$ = fromEvent(document, "keydown").pipe(
  filter((e: KeyboardEvent) => e.code === "Space"),
  tap((e) => e.preventDefault()),
  scan((prevState) => ({ pause: !prevState.pause }), {
    pause: isPausedByDefault,
  }),
  share(),
  startWith({ pause: isPausedByDefault })
);

export const gameClock$ = pauses$.pipe(
  switchMap(({ pause }) => {
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
