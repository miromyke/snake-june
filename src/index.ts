import { filter, fromEvent, interval, map, tap } from "rxjs";
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

render(snake);
let nextSnake: Location[] = snake;
let axis: Axis = "x";
let direction: Direction = 1;

interval(500).subscribe(() => {
  render((nextSnake = moveInGivenDirection(nextSnake, axis, direction)));
});

fromEvent(document, "keydown")
  .pipe(
    filter((e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        return true;
      }
    }),
    tap((e) => {
      e.preventDefault();
    }),
    map((e) => e.key)
  )
  .subscribe((v) => {
    switch (v) {
      case "ArrowDown":
        if (axis !== "x") {
          break;
        }
        axis = "y";
        direction = 1;
        break;
      case "ArrowUp":
        if (axis !== "x") {
          break;
        }
        axis = "y";
        direction = -1;
        break;
      case "ArrowRight":
        if (axis !== "y") {
          break;
        }
        axis = "x";
        direction = 1;
        break;
      case "ArrowLeft":
        if (axis !== "y") {
          break;
        }
        axis = "x";
        direction = -1;
        break;
    }
  });
