import { move } from "./move";
import { Location, State } from "./types";

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
let nextSnake = snake;
setInterval(() => {
  render((nextSnake = move(nextSnake)));
}, 500);
