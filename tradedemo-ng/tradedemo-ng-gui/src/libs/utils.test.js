import {
  getDateString,
  toggleOpacity,
  getRandomInt,
  roundValue,
  padDigits
} from "./utils";

/**
 * This is unit test of utils helper functions
 */

describe("getDateString", () => {
  const date = new Date(100);
  it("should returns ISOString date with no format parameter", () => {
    expect(getDateString(date)).toEqual("1970-01-01T00:00:00.100Z");
  });

  it("should returns ISOString date with invalid as format parameter", () => {
    expect(getDateString(date, "invalid")).toEqual("1970-01-01T00:00:00.100Z");
  });

  it("should returns dateOnly", () => {
    expect(getDateString(date, "dateOnly")).toEqual("1970-01-01");
  });

  it("should returns dateTimeFormat", () => {
    expect(getDateString(date, "dateTimeFormat")).toEqual("1970-01-01 00:00:00.100");
  });
});

describe("toggleOpacity", () => {
  it("should returns 0.5 when selectedValue is same as opacityValue on equalCompare", () => {
    expect(toggleOpacity("same", "same", true)).toEqual(0.5);
  });

  it("should returns 1.0 when selectedValue is not same as opacityValue on equalCompare", () => {
    expect(toggleOpacity("same", "notSame", true)).toEqual(1);
  });

  it("should returns 1.0 when selectedValue is same as opacityValue on Not equalCompare", () => {
    expect(toggleOpacity("same", "same", false)).toEqual(1.0);
  });

  it("should returns 0.5 when selectedValue is not same as opacityValue Not on equalCompare", () => {
    expect(toggleOpacity("same", "notSame", false)).toEqual(0.5);
  });
});

describe("getRandomInt", () => {
  it("should returns number when min range equals to max range", () => {
    expect(getRandomInt(1, 1)).toEqual(1);
  });

  it("should throw exception when min is greater than max for negative number", () => {
    expect(() => getRandomInt(-1, -2)).toThrow();
  });

  it("should returns number within range", () => {
    for (let i = 0; i < 10; i++) {
      // Given
      const min = 0;
      const max = 10;

      // When
      const range = getRandomInt(min, max);

      // Then
      expect(range).toBeGreaterThanOrEqual(min);
      expect(range).toBeLessThanOrEqual(max);
    }
  });
});

describe("roundValue", () => {
  it("should round down value to 0 decimal", () => {
    expect(roundValue(1.111, 1)).toEqual(1);
  });

  it("should round up value to 0 decimal", () => {
    expect(roundValue(1.51, 1)).toEqual(2);
  });

  it("should round down value to 1 decimal", () => {
    expect(roundValue(1.111, 10)).toEqual(1.1);
  });

  it("should round up value to 1 decimal", () => {
    expect(roundValue(1.561, 10)).toEqual(1.6);
  });
});

describe("padDigits", () => {
  it("should convert to String and not pad for 0", () => {
    expect(padDigits(5, 0)).toEqual("5");
  });

  it("should convert to String and not pad if padding is 1 for 1 digit", () => {
    expect(padDigits(5, 1)).toEqual("5");
  });

  it("should convert to String and pad 1 digit if padding is 2 for 2 digit", () => {
    expect(padDigits(5, 2)).toEqual("05");
  });

  it("should convert to String and pad 8 digit if padding is 10 for 2 digit", () => {
    expect(padDigits(15, 10)).toEqual("0000000015");
  });

});
