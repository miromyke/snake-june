import {
  combineLatest,
  map,
  merge,
  mergeAll,
  scan,
  startWith,
  tap,
} from "rxjs";
import { directions$ } from "./directions";
import { gameClock$ } from "./gameClock";
import { moveInGivenDirection } from "./move";
import { Axis, Direction, Location } from "./types";

const snake = [
  { x: 10, y: 10 },
  { x: 11, y: 10 },
  { x: 12, y: 10 },
  { x: 13, y: 10 },
  { x: 14, y: 10 },
];

const locToStr = (loc: Location) => `${loc.x}-${loc.y}`;

const meshSize = 25;
const container = document.querySelector("#root");

let initialRender = true;
const meshNodes: Record<string, HTMLDivElement> = {};
const snakeNodes: Record<string, HTMLDivElement> = {};

function render(snake: Location[]) {
  if (initialRender) {
    new Array(meshSize ** 2).fill(null).map((_, idx) => {
      const meshNode = document.createElement("div");
      const xCoord = idx % meshSize;
      const yCoord = Math.ceil(idx / meshSize);
      const loc = locToStr({ x: xCoord, y: yCoord });
      meshNodes[loc] = meshNode;

      const snakeNode = document.createElement("div");
      snakeNodes[loc] = snakeNode;
      meshNode.appendChild(snakeNode);

      container.appendChild(meshNode);
    });

    initialRender = false;

    render(snake);
    return;
  }

  const occupied = snake.reduce((acc, location) => {
    acc[locToStr(location)] = true;
    return acc;
  }, {} as Record<string, boolean>);
  for (let i in snakeNodes) {
    snakeNodes[i].className = occupied[i] ? "occupied" : "";
  }
}

const snake$ = merge(
  gameClock$.pipe(
    map((v) => {
      if (v.pause) {
        return { ...v, type: "pause" };
      }

      return { ...v, type: "tick" };
    })
  ),
  directions$.pipe(map((v) => ({ ...v, type: "turn" })))
).pipe(
  scan(
    (acc, action) => {
      if (action.type === "tick") {
        return {
          ...acc,
          snakeLocation: moveInGivenDirection(
            acc.snakeLocation,
            acc.axis,
            acc.direction
          ),
        };
      }

      if (action.type === "turn") {
        return {
          ...acc,
          direction: action.direction,
          axis: action.axis,
        };
      }

      return acc;
    },
    {
      direction: 1,
      axis: "x",
      snakeLocation: [
        { x: 10, y: 10 },
        { x: 11, y: 10 },
        { x: 12, y: 10 },
        { x: 13, y: 10 },
        { x: 14, y: 10 },
      ],
    } as { axis: Axis; direction: Direction; snakeLocation: Location[] }
  )
);

const game$ = snake$.pipe(
  tap((v) => {
    render(v.snakeLocation);
  })
);

game$.subscribe();
