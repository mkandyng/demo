import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import LabelTextArea from "./LabelTextArea";

/**
 * This is unit test for the LabelTextArea widget
 * It leverage snapshot to test the presentation
 * and a functional test to check the onClick call
 */

describe("LabelTextArea", () => {
  const props = {
    label: "label",
    name: "name",
    maxLength: 100,
    value: "value",
    handleOnChange: jest.fn()
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<LabelTextArea {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should call handleOnClick prop with given event", () => {
    // Given
    const event = 1
    const component = shallow(<LabelTextArea {...props}/>);

    // When
    component.find("textarea").simulate('change', event);

    // Then
    expect(props.handleOnChange).toBeCalledWith(event);
  });

});
