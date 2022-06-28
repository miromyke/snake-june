import { moveInCurrentDirection, moveInGivenDirection } from "./move";

describe("moveInCurrentDirection", () => {
  it("should move the snake 1", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ];
    expect(moveInCurrentDirection(snake)).toEqual([
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
    expect(moveInCurrentDirection(snake)).toEqual([
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ]);
  });

  it("should move the snake 3", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
    ];
    expect(moveInCurrentDirection(snake)).toEqual([
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ]);
  });

  it("should not move a snake when it is too small", () => {
    const snake = [{ x: 2, y: 2 }];
    expect(() => moveInCurrentDirection(snake)).toThrow();
  });
});

describe("moveInGivenDirection", () => {
  it("should move the snake in a given direction 1", () => {
    const snake = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ];
    expect(moveInGivenDirection(snake, "x", 1)).toEqual([
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
    ]);
  });

  it("should move the snake in a given direction 2", () => {
    const snake = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ];
    expect(moveInGivenDirection(snake, "x", -1)).toEqual([
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 0, y: 3 },
    ]);
  });

  it("should move the snake in a given direction 3", () => {
    const snake = [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ];
    expect(moveInGivenDirection(snake, "y", 1)).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
    ]);
  });

  it("should move the snake in a given direction 4", () => {
    const snake = [
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ];
    expect(moveInGivenDirection(snake, "y", -1)).toEqual([
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 6, y: 3 },
    ]);
  });

  it("should not move the snake in an opposite direction (x)", () => {
    const snake = [
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ];
    expect(() => moveInGivenDirection(snake, "x", -1)).toThrow();
  });

  it("should move the snake in a given direction 5", () => {
    const snake = [
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ];
    expect(moveInGivenDirection(snake, "x", 1)).toEqual([
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 7, y: 4 },
    ]);
  });

  it("should not move the snake in an opposite direction (y)", () => {
    const snake = [
      { x: 4, y: 4 },
      { x: 4, y: 5 },
      { x: 4, y: 6 },
    ];
    expect(() => moveInGivenDirection(snake, "y", -1)).toThrow();
  });
});
