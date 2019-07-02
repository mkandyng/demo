import submitTicket from "./submitTicket";

/**
 * This is unit test of submitTicket. Focus is to test the basic happy and validation path
 * and not each individual test cases
 */

describe("submitTicket validation", () => {

    const submitObject = { ticket: { quantity: 1,
                                     expiryType: "DAY",
                                     expiryDate: new Date(),
                                     orderType:"Limit",
                                     price: 1.0},
                           instrument: {price: 1.02},
                           buySell: "buy",
                           confirmOrder: true,
                           placeOrder: jest.fn(),
                           updateOrder: jest.fn()};

    beforeAll(() => {
        jest.useFakeTimers();
    });

    it("should return false for invalid submit object", () => {
        // Given
        window.alert = jest.fn()
        // When
        const success = submitTicket({...submitObject,
                                      ticket: { ...submitObject.ticket, quantity:0 } });

        // Then
        expect(window.alert).toHaveBeenCalled();
        expect(submitObject.placeOrder).not.toHaveBeenCalled();
        expect(success).toBeFalsy();
    });

    it("should return false when confirmPlaceOrder is false", () => {
        // Given
        window.confirm = jest.fn(() => false)
        // When
        const success = submitTicket(submitObject);

        // Then
        expect(window.confirm).toHaveBeenCalled();
        expect(success).toBeFalsy();
    });

    it("should place order and generate order life cycle for valide order", done => {
        // Given
        window.confirm = jest.fn(() => true)
        // When
        const success = submitTicket(submitObject);

        // Then
        expect(window.confirm).toHaveBeenCalled();
        expect(submitObject.placeOrder).toBeCalledTimes(1);
        jest.runAllTimers();
        expect(submitObject.updateOrder).toHaveBeenCalled();
        expect(success).toBeTruthy();
        done();
    });
});
