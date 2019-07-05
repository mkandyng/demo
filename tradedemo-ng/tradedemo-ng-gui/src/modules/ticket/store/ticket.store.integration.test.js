import { createStore } from "redux";
import { ticketReducer } from "./ticketReducer";
import { updateTicket } from "./ticketActions";

/**
 *
 * This is integration test of the actions/reducer for ticket redux store
 * Each ticket actions are invoked and verified expected store state
 *
 */

describe("ticket store integration tests", () => {

    let ticket = undefined;
    let store = undefined;

    beforeEach(() => {
        store = createStore(ticketReducer);
        store.dispatch({type: "invalidAction"});
        ticket = store.getState();
    });

    it("should updateTicket on a signle property ", done => {
        // Given
        const updateProps = {symbol: "symbol"};
        const action = updateTicket(updateProps);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({ ...ticket, ...updateProps});
        done();
    });

    it("should updateTicket on a mutliple properties ", done => {
        // Given
        const updateProps = {symbol: "symbol", orderId: "XA12345678", quantity: 10};
        const action = updateTicket(updateProps);

        // When
        store.dispatch(action);

        // Then
        expect(store.getState()).toStrictEqual({ ...ticket, ...updateProps});
        done();
    });

});
