import { createStore } from "redux";
import { orderbookStatusEnum } from "../orderbookStatusEnum";
import { orderbookReducer } from "./orderbookReducer";
import { getDateString } from "../../../libs/utils";
import { placeOrder,
         updateOrder } from "./orderbookActions";

/**
 *
 * This is integration test of the actions/reducer for order redux store
 * Each order actions are invoked and verified expected store state
 *
 */

describe("orderbook integration tests", () => {

    let orders = undefined;
    let store = undefined;

    const mockModule = require('../../../libs/utils');
    const expectedDate = "2019-10-10 11:11:11.123";
    mockModule.getDateString = jest.fn(() => "2019-10-10 11:11:11.123");

    beforeEach(() => {
        orders = createOrders(10);
        store = createStore(orderbookReducer);
    });

    it("should placeOrder ", done => {
        // Given
        const action = placeOrder(orders[0]);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual([{ ...orders[0],
                                                  lastUpdated: expectedDate,
                                                  status: orderbookStatusEnum.status.REQUESTED.displayName}]);
        done();
    });

    it("should update an existing order ", done => {
        // Given
        orders.forEach(order => store.dispatch(placeOrder(order)));
        const expectedOrders = orders.map(order => ({ ...order,
                                                      lastUpdated: expectedDate,
                                                      status: orderbookStatusEnum.status.REQUESTED.displayName})).reverse();

        const updatingOrder = { ...expectedOrders.pop(), status: orderbookStatusEnum.status.WORKING.displayName}
        const action = updateOrder(updatingOrder);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual([updatingOrder, ...expectedOrders]);
        done();
    });

});

function createOrders(count) {
    let orders = [];
    for (let i=0; i<= count; i++) {
        orders.push({ orderRef:"XA00000000" + i,
                      created: getDateString(new Date(), "dateTimeFormat"),
                      symbol: "symbol" + i,  name:"instrument" + i,
                      currency: "USD"});
    }
    return orders;
}
