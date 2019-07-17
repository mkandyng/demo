import React from "react";
import toJson from "enzyme-to-json";
import {mount} from "enzyme";
import Documentation from "./Documentation";

/**
 * This is unit test of Documentation component
 * It leverage snapshot to test the presentation
 */

describe("Documentation", () => {

  it("should render component comparing with previous snapshot shallow markup", () => {
    // Given

    // When
    const component = mount(<Documentation/>);

    // Then
    expect(toJson(component)).toMatchSnapshot();
  });

});
