import { canMoveNext } from "./utils";

describe("isValidTurn", () => {
  it("should not allow moving back", () => {
    expect(
      canMoveNext(
        {
          axis: "x",
          direction: 1,
        },
        {
          axis: "x",
          direction: -1,
        }
      )
    ).toBe(false);

    expect(
      canMoveNext(
        {
          axis: "y",
          direction: 1,
        },
        {
          axis: "y",
          direction: -1,
        }
      )
    ).toBe(false);

    expect(
      canMoveNext(
        {
          axis: "y",
          direction: 1,
        },
        {
          axis: "x",
          direction: -1,
        }
      )
    ).toBe(true);

    expect(
      canMoveNext(
        {
          axis: "x",
          direction: 1,
        },
        {
          axis: "y",
          direction: -1,
        }
      )
    ).toBe(true);
  });
});
