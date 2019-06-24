import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import ReactTable from "react-table";
import Orderbook, {OrderbookView, orderBookHeaderColumns } from "./Orderbook";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("Orderbook", () => {
    const props = {
      orderbook: [ {  orderRef:"XA12345678",
                      symbol: "AMZ" } ]
    };

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<Orderbook orderbook={props.orderbook} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should registered event handler correctly with OrderbookView", () => {
        // Given
        const localProps = {
            orderbook: props,
            columns:orderBookHeaderColumns,
            eventHandler: {
                getTheadThProps: jest.fn(),
                getTrProps: jest.fn()
            }
        };

        // When
        const component = shallow(<OrderbookView {...localProps} />);

        // Then
        const reactTable = component.find(ReactTable);
        expect(toJson(component)).toMatchSnapshot();
        expect(reactTable.find({ getTheadThProps: localProps.eventHandler.getTheadThProps })
                         .exists()).toBeTruthy();
        expect(reactTable.find({ getTrProps: localProps.eventHandler.getTrProps})
                         .exists()).toBeTruthy();
    });

});
