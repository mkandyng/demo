import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import LabelInput from "./LabelInput";

/**
 * This is unit test for the LabelInput widget
 * It leverage snapshot to test the presentation
 * and a functional test to check the onClick call
 */

describe("LabelInput", () => {
    const props = { id: "id",
                  label: "label",
                  style: "style",
                  type: "number",
                  name: "name",
                  step: 1,
                  value: 12,
                  handleOnChange: jest.fn() }

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<LabelInput {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should call handleOnClick prop with given event", () => {
        // Given
        const event = 1
        const component = shallow(<LabelInput {...props} />);

        // When
        component.find("input").simulate('change', event);

        // Then
        expect(props.handleOnChange).toBeCalledWith(event);
    });

});
