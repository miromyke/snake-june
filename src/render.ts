import { Face, Location, Location3D } from "./types";

const meshSize = 25;

const locToStr = (loc: Location) => `${loc.x}-${loc.y}`;

const createFace = (meshSize: number, face: Face) => {
  const container = document.createElement("div");
  container.classList.add(`mesh-${face}`);
  container.classList.add("mesh");

  let meshNodes: Record<string, HTMLDivElement> = {};
  let snakeNodes: Record<string, HTMLDivElement> = {};

  new Array(meshSize ** 2).fill(null).forEach((_, idx) => {
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

  return {
    meshNodes,
    snakeNodes,
    container,
  };
};

interface Board {
  container: HTMLDivElement;
  faces: Record<
    Face,
    {
      meshNodes: Record<string, HTMLDivElement>;
      snakeNodes: Record<string, HTMLDivElement>;
      container: HTMLDivElement;
    }
  >;
}

export const renderBoard = (meshSize: number): Board => {
  const root = document.createElement("div");
  root.classList.add("mesh-cube");

  const frontFace = document.createElement("div");
  frontFace.classList.add("mesh");

  const faces = {
    front: createFace(meshSize, "front"),
    back: createFace(meshSize, "back"),
    top: createFace(meshSize, "top"),
    bottom: createFace(meshSize, "bottom"),
    left: createFace(meshSize, "left"),
    right: createFace(meshSize, "right"),
  } as const;

  Object.values(faces).forEach((face) => {
    root.appendChild(face.container);
  });

  return {
    container: root,
    faces,
  };
};

export const createRenderer = (meshSize: number) => {
  let board: Board;

  function render(snake: Location3D[]) {
    if (!board) {
      board = renderBoard(meshSize);
      document.querySelector("#root").appendChild(board.container);
      render(snake);
      return;
    }

    const occupiedCells: Record<Face, Record<string, boolean>> = {
      top: {},
      bottom: {},
      right: {},
      left: {},
      front: {},
      back: {},
    };

    snake.forEach((location) => {
      const cells = (occupiedCells[location.face] =
        occupiedCells[location.face] ?? {});
      cells[locToStr(location)] = true;
    });

    Object.entries(occupiedCells).forEach(([face, locations]) => {
      Object.values(board.faces[face as Face].snakeNodes).forEach((node) => {
        node.className = "";
      });
      Object.keys(locations).forEach((location) => {
        board.faces[face as Face].snakeNodes[location].className = "occupied";
        board.faces[face as Face].meshNodes[location].className = "occupied";
      });
    });

    board.container.dataset.face = snake[snake.length - 1].face;
  }
  return render;
};
