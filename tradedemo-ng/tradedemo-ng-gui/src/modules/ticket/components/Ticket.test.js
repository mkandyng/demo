import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
import BuySellButton from "../../../components/buySellButton/BuySellButton";
import SelectionDropDown from "../../../components/selectionDropDown/SelectionDropDown";
import LabelInput from "../../../components/labelInput/LabelInput";
import LabelTextArea from "../../../components/labelTextArea/LabelTextArea";
import Ticket, { TicketView } from "./Ticket";

/**
 * This is unit test of Orderbook component
 * It leverage snapshot to test the presentation
 */

describe("Ticket", () => {
    const ticket = {
        symbol: "symbol",
        quantity: 5,
        orderType: "Market",
        price: 0,
        expiryType: "Day",
        expiryDate: "2019-10-12",
        note: ""};
    const props = { instrument: ticket,
                    placeOrder: jest.fn(),
                    updateOrder: jest.fn() };


    it("should render component comparing with previous snapshot shallow markup", () => {
        // Given

        // When
        const component = shallow(<Ticket {...props} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();
    });

    it("should render TicketView component comparing with previous snapshot shallow markup", () => {
        // Given
        const localProps = { ticket: ticket,
                             instrument: ticket,
                             eventHandler: { symbolChange: jest.fn(),
                                             expiryDateChange: jest.fn(),
                                             quantityChange: jest.fn(),
                                             priceChange: jest.fn(),
                                             noteChange: jest.fn(),
                                             orderTypeChange: jest.fn(),
                                             priceStyle: {opacity: "0.5"},
                                             orderType: jest.fn(),
                                             price: 1.23,
                                             expiryTypeChange: jest.fn(),
                                             expiryDateStyle: {opacity: "0.5"},
                                             expiryType: "Limit",
                                             expiryDate: "2109-06-11",
                                             handleOnSubmit: jest.fn()
                                         }
                               };

        // When
        const component = shallow(<TicketView {...localProps} />);

        // Then
        expect(toJson(component)).toMatchSnapshot();

        const form = component.find("form");

        expect(form.find(LabelInput).find({ handleOnChange: localProps.eventHandler.symbolChange })
                         .exists()).toBeTruthy();
        expect(form.find(LabelInput).find({ handleOnChange: localProps.eventHandler.quantityChange })
                         .exists()).toBeTruthy();
        expect(form.find(SelectionDropDown).find({ handleOnChange: localProps.eventHandler.orderTypeChange })
                                          .exists()).toBeTruthy();
        expect(form.find(LabelInput).find({ handleOnChange: localProps.eventHandler.priceChange })
                                          .exists()).toBeTruthy();
        expect(form.find(SelectionDropDown).find({ handleOnChange: localProps.eventHandler.expiryTypeChange })
                                           .exists()).toBeTruthy();
        expect(form.find(LabelInput).find({ handleOnChange: localProps.eventHandler.expiryDateChange })
                                           .exists()).toBeTruthy();
        expect(form.find(LabelTextArea).find({ handleOnChange: localProps.eventHandler.noteChange })
                                           .exists()).toBeTruthy();
        expect(form.find(BuySellButton).find({id: "sell"}).find({ handleOnClick: localProps.eventHandler.handleOnSubmit})
                                           .exists()).toBeTruthy();
        expect(form.find(BuySellButton).find({id: "buy"}).find({ handleOnClick: localProps.eventHandler.handleOnSubmit})
                                           .exists()).toBeTruthy();

    });

});
