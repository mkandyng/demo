import { orderbookStatusEnum } from "./orderbookStatusEnum";
import { from } from "rxjs";

/**
 * This is unit test of orderbookStatusEnum, testing the configuration of
 * the enumeration and its support functions
 */

describe("orderbookStatusEnum", () => {
    it("should contains expected properties for orderbook status", done => {
        from(Object.values(orderbookStatusEnum.status))
        .subscribe(enumValue => {
            expect(enumValue).toHaveProperty("displayName");
            expect(enumValue).toHaveProperty("backgroundColor");
            expect(enumValue).toHaveProperty("color");
            done();
        });
    });

    it("should should get me a valid enum status as final status", () => {
        for(let i=0; i<10; i++) {
            expect(orderbookStatusEnum.getRandomFinalOrderStatus()).not.toBeNull();
        }
    });

    it("should return corresponding status given a displayName", done => {
        from(Object.values(orderbookStatusEnum.status))
        .subscribe(enumValue => {
            expect(orderbookStatusEnum.getOrderStatus(enumValue.displayName)).toEqual(enumValue);
            done();
        });
    });
});
