import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import { UnWrapTopLayout } from "./TopLayout";

/**
 * This is unit test of TopLayout component
 * It leverage snapshot to test the presentation
 */

describe("UnWrapTopLayout", () => {
    const props = { instruments: [{ symbol: "symbol" }],
                    instrument: { symbol: "symbol" },
                    marketfeed: { instruments: [{symbol:"symbol"} ],
                                  selected: {symbol:"symbol"} }
    }


    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<UnWrapTopLayout {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
