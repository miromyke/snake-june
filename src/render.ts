import { Location } from "./types";

const meshSize = 25;

const locToStr = (loc: Location) => `${loc.x}-${loc.y}`;

export const createRenderer = (container: HTMLElement) => {
  let initialRender = true;
  let meshNodes: Record<string, HTMLDivElement> = {};
  let snakeNodes: Record<string, HTMLDivElement> = {};

  return function render(snake: Location[]) {
    if (initialRender) {
      new Array(meshSize ** 2).fill(null).map((_, idx) => {
        const meshNode = document.createElement("div");
        const xCoord = idx % meshSize;
        const yCoord = Math.floor(idx / meshSize);

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
  };
};
