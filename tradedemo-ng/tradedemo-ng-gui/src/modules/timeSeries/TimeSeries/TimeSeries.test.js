import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import TimeSeries from "./TimeSeries";
import {Line} from "recharts";

/**
 * This is unit test for the TimeSeries widget
 * It leverage snapshot to test the presentation
 */

describe("TimeSeries", () => {
    const props = {
                timeSeries: {chartData: [{name: "2019-12-23",
                                   price: 1.0}],
                                   minValue: 1.0,
                                   maxValue: 1.0},
                childElements: [<Line key="line1" type="monotone" dataKey="open" stroke="#8884d8" activeDot={{r: 8}}/>]
    };

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<TimeSeries {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
