import placeOrderToMarket from "./placeOrderToMarket";
import { orderbookStatusEnum } from "../../../libs/orderbookStatusEnum";

/**
 * This is unit test of placeOrderToMarket, simulate typical order events lifecycle
 */


describe("placeOrderToMarket", () => {

    let placeOrder = jest.fn();
    let updateOrder = jest.fn();

    const order = {
        orderRef:"XA"+ 12345679,
        executed: 0,
        midPrice: 1.0,
        orderType: "Limit",
        quantity: 10,
    }

    beforeAll(() => {
        jest.useFakeTimers();
        placeOrder = jest.fn();
        updateOrder = jest.fn();
    });

    function verifyPlaceOrder(order, endStatus) {
        // Given
        const utilsModule = require('../../../libs/utils');
        const rejectedStatusIndex = Object.keys(orderbookStatusEnum.status).indexOf(endStatus);
        const endStatusEnum = orderbookStatusEnum.status[endStatus];
        utilsModule.getRandomInt = jest.fn((min, max)=> rejectedStatusIndex);

        // When
        placeOrderToMarket(order, placeOrder, updateOrder);

        // Then
        expect(placeOrder).toHaveBeenCalledWith(expect.objectContaining({
                                                ...order,
                                                  executed: 0,
                                                  created: expect.any(String),
                                                  lastUpdated: expect.any(String),
                                                  status: orderbookStatusEnum.status.REQUESTED.displayName
                                              }));

       jest.runAllTimers();
       expect(updateOrder).toHaveBeenLastCalledWith(expect.objectContaining({
                                                      ...order,
                                                      status: endStatusEnum.displayName
                                                   }));
    }

    it("should place order and update last status to REJECTED when exchange reject", () => {
      verifyPlaceOrder(order, "REJECTED");
    });

    it("should place order and update last status to CANCELLED when expiryType is FOK and exchange is cancelled", () => {
      verifyPlaceOrder({...order, expiryType: "FOK"}, "CANCELLED");
    });

    it("should place order and update last status to PARTFILLED", () => {
      verifyPlaceOrder({...order, quantity: 2, executed: 1}, "PARTFILLED");
    });

    it("should place order and executed order event life cycle with working->partfilled->filled", () => {
      const newOrder = {...order, quantity: 2, executed: 2};
      verifyPlaceOrder(newOrder, "FILLED");
      expect(updateOrder).toHaveBeenCalledWith(expect.objectContaining({
                                               ...newOrder,
                                                executed: 0,
                                                status: orderbookStatusEnum.status.WORKING.displayName
                                            }));
      expect(updateOrder).toHaveBeenCalledWith(expect.objectContaining({
                                                                        ...newOrder,
                                                                        executed: 1,
                                                                        status: orderbookStatusEnum.status.PARTFILLED.displayName
                                                                        }));
    });

});
