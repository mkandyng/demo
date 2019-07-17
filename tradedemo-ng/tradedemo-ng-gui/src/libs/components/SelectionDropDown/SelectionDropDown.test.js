import React from "react";
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import SelectionDropDown from "./SelectionDropDown";

/**
 * This is unit test for the SelectableTabs widget
 * It leverage snapshot to test the presentation
 * and a functional test to check the onSelect call
 */

describe("SelectionDropDown", () => {
  const props = {
    id: "id",
    label: "label",
    name: "name",
    list: [
      "item1", "item2"
    ],
    handleOnChange: jest.fn()
  };

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = shallow(<SelectionDropDown {...props}/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should call onChange prop with given event", () => {
    // Given
    const event = 1
    const component = shallow(<SelectionDropDown {...props}/>);

    // When
    component.find("select").simulate('change', event);

    // Then
    expect(props.handleOnChange).toBeCalledWith(event);
  });

});
