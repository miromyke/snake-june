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
  forkJoin,
} from "rxjs";

const pause$ = fromEvent(document, "keydown").pipe(
  filter((e: KeyboardEvent) => e.code === "Space"),
  scan((prevState) => ({ pause: !prevState.pause }), { pause: false })
);

export const gameClock$ = pause$.pipe(
  startWith({ pause: false }),
  switchMap(({ pause }) => {
    if (pause) {
      return of({ pause: true, incrementDuration: false });
    }

    return merge(
      of({ pause: false, incrementDuration: false }),
      interval(500).pipe(map(() => ({ pause: false, incrementDuration: true })))
    );
  }),
  scan(
    ({ tick }, { pause, incrementDuration }) => ({
      pause,
      tick: incrementDuration ? tick + 1 : tick,
    }),
    {
      tick: 0,
      pause: false,
    }
  )
);
