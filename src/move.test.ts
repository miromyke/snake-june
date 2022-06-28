import { move } from "./move";

describe("move", () => {
  it("should move the snake 1", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ];
    expect(move(snake)).toEqual([
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
    ]);
  });

  it("should move the snake 2", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    expect(move(snake)).toEqual([
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ]);
  });

  it("should move the snake 3", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    expect(move(snake)).toEqual([
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it("should not move a snake when it is too small", () => {
    const snake = [{ x: 2, y: 2 }];
    expect(() => move(snake)).toThrow();
  });
});
