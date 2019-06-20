import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import BuySellButton from "./BuySellButton";

/**
 * This is unit test for the BuySellButton widget
 * It leverage snapshot to test the presentation
 * and a functional test to check the onClick call
 */

describe("BuySellButton", () => {
  const props = {
          id: "id",
          containerId: "divId",
          label: "label",
          buttonName: "buttonName",
          handleOnClick: jest.fn()};

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<BuySellButton {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should call handleOnClick prop with given event", () => {
        // Given
        const event = 1
        const component = shallow(<BuySellButton {...props} />);

        // When
        component.find("div#" + props.containerId).simulate('click', event);

        // Then
        expect(props.handleOnClick).toBeCalledWith(event);
    });

});
