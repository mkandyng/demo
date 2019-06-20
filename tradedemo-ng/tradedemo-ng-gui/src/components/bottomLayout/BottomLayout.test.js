import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import { UnwrapBottomLayout } from "./BottomLayout";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("UnwrapBottomLayout", () => {
    const props = { symbol: "symbol",
                    orderbook: [{symbol:"symbol"}],
                    intradayTimeSeries: {},
                    dailyTimeSeries: {},
                    fetchIntradayTimeSeries: jest.fn(),
                    fetchDailyTimeSeries: jest.fn() };


    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<UnwrapBottomLayout {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
