import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { Tabs } from "react-tabs";
import SelectableTabs from "./SelectableTabs";

/**
 * This is unit test for the SelectableTabs widget
 * It leverage snapshot to test the presentation
 * and a functional test to check the onSelect call
 */

describe("SelectableTabs", () => {
    const props = {
       containerId: "bottomLayout",
       selectedTab: 1,
       updateSelectedTab: jest.fn(),
       tabs: [
         { name: "name1",
           panel: [<p key="1">Panel</p>] },
         { name: "name2",
           panel: [<p key="1">Panel1</p>, <p key="2">Panel2</p>] }
       ]
    }

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<SelectableTabs {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should call onSelect prop with given event", () => {
        // Given
        const event = 1
        const component = shallow(<SelectableTabs {...props} />);

        // When
        component.find(Tabs).simulate('select', event);

        // Then
        expect(props.updateSelectedTab).toBeCalledWith(event);
    });

});
