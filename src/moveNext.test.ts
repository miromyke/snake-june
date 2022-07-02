import { moveSnake } from "./moveNext";

describe("moveSnake", () => {
  describe("front to ...", () => {
    test("top", () => {
      expect(
        moveSnake(
          [
            { x: 10, y: 0, face: "front" },
            { x: 11, y: 0, face: "front" },
            { x: 12, y: 0, face: "front" },
          ],
          {
            axis: "y",
            direction: -1,
          },
          25
        )
      ).toEqual([
        { x: 11, y: 0, face: "front" },
        { x: 12, y: 0, face: "front" },
        { x: 12, y: 24, face: "top" },
      ]);
    });

    test("top without overreach", () => {
      expect(
        moveSnake(
          [
            { x: 10, y: 5, face: "front" },
            { x: 11, y: 5, face: "front" },
            { x: 12, y: 5, face: "front" },
          ],
          {
            axis: "y",
            direction: -1,
          },
          25
        )
      ).toEqual([
        { x: 11, y: 5, face: "front" },
        { x: 12, y: 5, face: "front" },
        { x: 12, y: 4, face: "front" },
      ]);
    });

    test("right", () => {
      expect(
        moveSnake(
          [
            { x: 23, y: 1, face: "front" },
            { x: 24, y: 1, face: "front" },
          ],
          {
            axis: "x",
            direction: 1,
          },
          25
        )
      ).toEqual([
        { x: 24, y: 1, face: "front" },
        { x: 0, y: 1, face: "right" },
      ]);
    });

    test("left", () => {
      expect(
        moveSnake(
          [
            { x: 3, y: 1, face: "front" },
            { x: 2, y: 1, face: "front" },
            { x: 1, y: 1, face: "front" },
            { x: 0, y: 1, face: "front" },
          ],
          {
            axis: "x",
            direction: -1,
          },
          25
        )
      ).toEqual([
        { x: 2, y: 1, face: "front" },
        { x: 1, y: 1, face: "front" },
        { x: 0, y: 1, face: "front" },
        { x: 24, y: 1, face: "left" },
      ]);
    });

    test("bottom", () => {
      expect(
        moveSnake(
          [
            { x: 2, y: 22, face: "front" },
            { x: 2, y: 23, face: "front" },
            { x: 2, y: 24, face: "front" },
          ],
          {
            axis: "y",
            direction: 1,
          },
          25
        )
      ).toEqual([
        { x: 2, y: 23, face: "front" },
        { x: 2, y: 24, face: "front" },
        { x: 2, y: 0, face: "bottom" },
      ]);
    });
  });
});
