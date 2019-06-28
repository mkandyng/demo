import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import ReactTable from "react-table";
import InstrumentsMarketfeed, { InstrumentsMarketfeedView, columnHeaders } from "./InstrumentsMarketfeed";

/**
 * This is unit test of Marketfeed component
 * It leverage snapshot to test the presentation
 */

describe("InstrumentsMarketfeed", () => {
    const props = {
        marketfeedInstruments: [ { delete:<img src="img/delete.png" alt="delete" />,
                                       symbol: "AMZ" } ],
        instrument: {symbol: "AMZ"},
        selectMarketfeedInstrument: jest.fn(),
        deleteMarketfeedInstrument: jest.fn(),
        updateMarketfeedInstrument: jest.fn()
    };

    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<InstrumentsMarketfeed {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should registered event handler correctly", () => {
        // Given
        const localProps = {
            instruments: props.marketfeedInstruments,
            columns: columnHeaders,
            eventHandlers: {
                handleTableColumn: jest.fn(),
                handleTableRow: jest.fn()
            }
        };

        // When
        const component = shallow(<InstrumentsMarketfeedView {...localProps} />);

        // Then
        const reactTable = component.find(ReactTable);
        expect(reactTable.find({ getTdProps: localProps.eventHandlers.handleTableColumn })
                         .exists()).toBeTruthy();
        expect(reactTable.find({ getTrProps: localProps.eventHandlers.handleTableRow })
                         .exists()).toBeTruthy();
    });
});
