import { partition } from "./partition";

describe("partition", () => {
  it("should partition a snake 1", () => {
    const snake = [
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      //
      { x: 6, y: 6 },
      { x: 7, y: 6 },
      { x: 8, y: 6 },
      { x: 9, y: 6 },
      //
      { x: 9, y: 7 },
      { x: 9, y: 8 },
      { x: 9, y: 9 },
      { x: 9, y: 10 },
      //
      { x: 10, y: 10 },
      //
      { x: 10, y: 9 },
    ];

    expect(partition(snake)).toEqual([
      {
        value: [
          { x: 5, y: 3 },
          { x: 5, y: 4 },
          { x: 5, y: 5 },
          { x: 5, y: 6 },
        ],
        axis: "y",
        direction: 1,
      },
      {
        value: [
          { x: 6, y: 6 },
          { x: 7, y: 6 },
          { x: 8, y: 6 },
          { x: 9, y: 6 },
        ],
        axis: "x",
        direction: 1,
      },
      {
        value: [
          { x: 9, y: 7 },
          { x: 9, y: 8 },
          { x: 9, y: 9 },
          { x: 9, y: 10 },
        ],
        axis: "y",
        direction: 1,
      },
      {
        value: [{ x: 10, y: 10 }],
        axis: "x",
        direction: 1,
      },
      {
        value: [{ x: 10, y: 9 }],
        axis: "y",
        direction: -1,
      },
    ]);
  });

  it("should partition a snake 2", () => {
    const snake = [
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      //
      { x: 6, y: 4 },
      //
      { x: 6, y: 3 },
      //
      { x: 7, y: 3 },
      { x: 8, y: 3 },
    ];

    expect(partition(snake)).toEqual([
      {
        value: [
          { x: 5, y: 3 },
          { x: 5, y: 4 },
        ],
        direction: 1,
        axis: "y",
      },
      {
        value: [{ x: 6, y: 4 }],
        direction: 1,
        axis: "x",
      },
      {
        value: [{ x: 6, y: 3 }],
        direction: -1,
        axis: "y",
      },
      {
        value: [
          { x: 7, y: 3 },
          { x: 8, y: 3 },
        ],
        direction: 1,
        axis: "x",
      },
    ]);
  });

  it("should partition a snake", () => {
    const snake = [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    expect(partition(snake)).toEqual([
      {
        axis: "y",
        direction: 1,
        value: [
          {
            x: 2,
            y: 2,
          },
          {
            x: 2,
            y: 3,
          },
        ],
      },
    ]);
  });
});
