import {
  orderStatusEnum
} from "./orderStatusEnum";
import {
  from
} from "rxjs";

/**
 * This is unit test of orderStatusEnum, testing the configuration of
 * the enumeration and its support functions
 */

describe("orderStatusEnum", () => {
  it("should contains expected properties for orderbook status", done => {
    from(Object.values(orderStatusEnum.status))
      .subscribe(enumValue => {
        expect(enumValue).toHaveProperty("displayName");
        expect(enumValue).toHaveProperty("backgroundColor");
        expect(enumValue).toHaveProperty("color");
        done();
      });
  });

  it("should should get me a valid enum status as final status", () => {
    for (let i = 0; i < 10; i++) {
      expect(orderStatusEnum.getRandomFinalOrderStatus()).not.toBeNull();
    }
  });

  it("should return corresponding status given a displayName", done => {
    from(Object.values(orderStatusEnum.status))
      .subscribe(enumValue => {
        expect(orderStatusEnum.getOrderStatus(enumValue.displayName)).toEqual(enumValue);
        done();
      });
  });
});
