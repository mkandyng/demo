import React, {useEffect} from "react";
import { getRandomInt, toggleOpacity, getDateString } from "../../../libs/utils";
import BuySellButton from "../../../components/BuySellButton";
import LabelInput from "../../../components/LabelInput";
import LabelTextArea from "../../../components/LabelTextArea";
import SelectionDropDown from "../../../components/SelectionDropDown";
import submitTicket from "../submitTicket";
import "./ticket.css";

/**
 * [Ticket Component to handle ticket view and interaction]
 */

export default function Ticket({ ticket,
                                 instrument,
                                 placeOrder,
                                 updateOrder,
                                 updateTicket }) {

    useEffect ( () => {
        const MAX_ORDER_COUNT = 10;
        if(instrument.symbol !== undefined && ticket.orderId < MAX_ORDER_COUNT) {
            let buySell = getRandomInt(0,1) === 0 ? "Buy":"Sell";
            if(submitTicket({ ticket: ticket,
                              instrument: instrument,
                              buySell: buySell,
                              confirmOrder: false,
                              placeOrder: placeOrder,
                              updateOrder: updateOrder })) {
                updateTicket({...ticket, orderId: ticket.orderId+1});
            }
        }
    }, [instrument, ticket, placeOrder, updateOrder, updateTicket]);

    const eventHandler = {
        symbolChange:     e => updateTicket({price: instrument.price.toFixed(2)}),
        expiryDateChange: e => updateTicket({expiryDate: e.target.value}),
        quantityChange:   e => updateTicket({price: e.target.value}),
        priceChange:      e => updateTicket({price: e.target.value}),
        noteChange:       e => updateTicket({note: e.target.value}),
        orderTypeChange:  e => updateTicket({
                  priceStyle: {opacity: toggleOpacity(e.target.value, "Market", true)},
                  orderType: e.target.value,
                  price: instrument.price.toFixed(2)}),
        expiryTypeChange: e => updateTicket({
                  expiryDateStyle: {opacity: toggleOpacity(e.target.value, "GTD", false)},
                  expiryType: e.target.value,
                  expiryDate: e.target.value === "GTD"?getDateString(new Date(), "dateOnly"):""}),
        handleOnSubmit:   e => {
                  e.preventDefault();
                  const buySell = e.target.innerText;
                  if(submitTicket({ ticket:ticket,
                                   instrument:instrument,
                                   buySell:buySell,
                                   confirmOrder: true,
                                   placeOrder: placeOrder,
                                   updateOrder: updateOrder})) {
                      updateTicket({orderId: ticket.orderId+1});
                  }
        }
    };

    return (
      <TicketView ticket={ticket}
                  instrument={instrument}
                  eventHandler={eventHandler} />
    )
}

export function TicketView({ticket, instrument, eventHandler}) {
    return (
        <div id="ticket">
            <form>
                <LabelInput label="Symbol"
                            name="symbol"
                            type="text"
                            value={instrument.symbol}
                            handleOnChange={eventHandler.symbolChange} />
                <LabelInput label="Quantity"
                            name="quantity"
                            type="number"
                            step={5}
                            value={ticket.quantity}
                            handleOnChange={eventHandler.quantityChange} />
                <SelectionDropDown id="orderType"
                                   label="Order Type"
                                   name="orderType"
                                   list={["Market","Limit","Stop","Stop Limit"]}
                                   handleOnChange={eventHandler.orderTypeChange} />
                <LabelInput style={ticket.priceStyle}
                            label="Price"
                            name="price"
                            type="number"
                            step={0.1}
                            value={ticket.price}
                            handleOnChange={eventHandler.priceChange} />
                <SelectionDropDown id="expiryType"
                                   label="Expiry Type"
                                   name="expiryType"
                                   list={["Day","GTD","GTC","FOK"]}
                                   handleOnChange={eventHandler.expiryTypeChange} />
                <LabelInput style={ticket.expiryDateStyle}
                            label="Expiry Date"
                            name="expiryDate"
                            type="date"
                            step={0.1}
                            value={ticket.expiryDate}
                            handleOnChange={eventHandler.expiryDateChange} />
                <LabelTextArea
                           label="Note"
                           name="note"
                           maxLength={100}
                           value={ticket.note}
                           handleOnChange={eventHandler.noteChange} />

                <div>
                    <div id="buySell">
                        <BuySellButton containerId="sellButton"
                                       handleOnClick={eventHandler.handleOnSubmit}
                                       label={instrument.bidPrice}
                                       id="sell"
                                       buttonName="Sell" />
                        <BuySellButton containerId="buyButton"
                                       handleOnClick={eventHandler.handleOnSubmit}
                                       label={instrument.askPrice}
                                       id="buy"
                                       buttonName="Buy" />
                    </div>
                </div>
            </form>
        </div>
    )
}
