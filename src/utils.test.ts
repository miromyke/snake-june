import { isValidTurn } from "./utils";

describe("isValidTurn", () => {
  it("should not allow moving back", () => {
    expect(
      isValidTurn(
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
      isValidTurn(
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
      isValidTurn(
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
      isValidTurn(
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
