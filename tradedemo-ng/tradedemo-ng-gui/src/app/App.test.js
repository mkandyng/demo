import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import App from "./App";

/**
 * This is unit test of App
 * It leverage snapshot to test the presentation
 */

describe("App", () => {

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<App />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

});
