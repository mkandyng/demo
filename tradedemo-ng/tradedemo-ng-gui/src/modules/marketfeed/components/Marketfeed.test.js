import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import ReactTable from "react-table";
import { Marketfeed, MarketfeedView } from "./Marketfeed";

/**
 * This is unit test of Marketfeed component
 * It leverage snapshot to test the presentation
 */

describe("Marketfeed", () => {
    const props = {
        marketfeed: { instruments: [ { delete:<img src="img/delete.png" alt="delete" />,
                                       symbol: "AMZ" } ],
                      selected: {symbol:""}
                    },
        instruments: []
    };

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<Marketfeed {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should registered event handler correctly", () => {
        // Given
        const localProps = {
            instruments: props.marketfeed.instruments,
            columnHeaders: [ { Header: "Remove", accessor: "delete", width: 70 },
                             { Header: "Symbol", accessor: "symbol", width: 100 } ],
            eventHandler: {
                handleTableColumn: jest.fn(),
                handleTableRow: jest.fn()
            }
        };

        // When
        const component = shallow(<MarketfeedView {...localProps} />);

        // Then
        const reactTable = component.find(ReactTable);
        expect(reactTable.find({ getTdProps: localProps.eventHandler.handleTableColumn })
                         .exists()).toBeTruthy();
        expect(reactTable.find({ getTrProps: localProps.eventHandler.handleTableRow })
                         .exists()).toBeTruthy();
    });
});
