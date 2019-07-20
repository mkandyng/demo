import React, {useState} from "react";
import {toggleOpacity, getDateString} from "../../../libs/utils";
import PropTypes from 'prop-types';
import BuySellButton from "../../../libs/components/BuySellButton";
import LabelInput from "../../../libs/components/LabelInput";
import LabelTextArea from "../../../libs/components/LabelTextArea";
import SelectionDropDown from "../../../libs/components/SelectionDropDown";
import submitTicket from "../submitTicket";
import "./ticket.css";

/**
 *
 * [Ticket Component to handle ticket view and interaction]
 *
 */

export default function Ticket({
    enableDemo,
    instrument,
    placeOrder,
    updateOrder
}) {
    const {ticket,
           handleInputChange,
           handleSubmit} = useTicketForm(instrument, placeOrder, updateOrder);

    return ((<div id="ticket">
      <form id="ticketForm">
        <LabelInput label="Symbol"
                    name="symbol"
                    type="text"
                    value={ticket.symbol}
                    handleOnChange={handleInputChange}/>
        <LabelInput label="Quantity"
                    name="quantity"
                    type="number"
                    step={5}
                    value={ticket.quantity}
                    handleOnChange={handleInputChange}/>
        <SelectionDropDown id="orderType"
                           label="Order Type"
                           name="orderType"
                           list={["Market", "Limit", "Stop", "Stop Limit"]}
                           value={ticket.orderType}
                           handleOnChange={handleInputChange}/>
        <LabelInput style={ticket.priceStyle}
                    label="Price"
                    name="price"
                    type="number"
                    step={0.1}
                    value={ticket.price}
                    handleOnChange={handleInputChange}/>
        <SelectionDropDown id="expiryType"
                           label="Expiry Type"
                           name="expiryType"
                           list={["Day", "GTD", "GTC", "FOK"]}
                           value={ticket.expiryType}
                           handleOnChange={handleInputChange}/>
        <LabelInput style={ticket.expiryDateStyle}
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    step={0.1}
                    value={ticket.expiryDate}
                    handleOnChange={handleInputChange}/>
        <LabelTextArea label="Note"
                       name="note"
                       maxLength={100}
                       value={ticket.note}
                       handleOnChange={handleInputChange}/>
        <div>
          <div id="buySell">
            <BuySellButton containerId="sellButton"
                           handleOnClick={e => handleSubmit(e, true)}
                           label={instrument.bidPrice}
                           id="sell"
                           buttonName="Sell"/>
            <BuySellButton containerId="buyButton"
                           handleOnClick={e => handleSubmit(e, true)}
                           label={instrument.askPrice}
                           id="buy"
                           buttonName="Buy"/>
          </div>
        </div>
      </form>
    </div>));
}

function useTicketForm(instrument, placeOrder, updateOrder) {
  const [ticket, setTicket] = useState({
    symbol: undefined,
    orderId: 0,
    quantity: 5,
    orderType: "Market",
    price: 0,
    expiryType: "Day",
    expiryDate: "",
    note: "",
    priceStyle: {opacity: "0.5"},
    expiryDateStyle: {opacity: "0.5"}
  });

  if (ticket.symbol !== instrument.symbol) {
    let newTicket = {...ticket, symbol: instrument.symbol};
    if (instrument.price !== undefined) {
      newTicket = {...newTicket, price: instrument.price.toFixed(2)};
    }
    setTicket(ticket => ({...ticket, ...newTicket}));
  }

  const handleSubmit = (event, confirmOrder) => {
    if (event) {
      event.preventDefault();
      const buySell = event.target.innerText;
      if (ticket.symbol && submitTicket({
        ticket: ticket,
        instrument: instrument,
        buySell: buySell,
        confirmOrder: confirmOrder,
        placeOrder: placeOrder,
        updateOrder: updateOrder
      })) {
        setTicket(ticket => ({...ticket, orderId: ticket.orderId + 1}));
      }
    }
  }

  const handleInputChange = event => {
    let newTicket = {[event.target.name]: event.target.value};
    if(event.target.type === "number") {
      newTicket = {[event.target.name]: Number(event.target.value)};
    }
    if(event.target.name === "orderType") {
      newTicket = {...newTicket,
                   priceStyle: {opacity: toggleOpacity(event.target.value, "Market", true)}};
    } else if(event.target.name === "expiryType") {
      newTicket = {...newTicket,
                   expiryDateStyle: {opacity: toggleOpacity(event.target.value, "GTD", false)},
                   expiryDate: event.target.value === "GTD"? getDateString(new Date(), "dateOnly"): ""};
    }
    setTicket(ticket => ({...ticket, ...newTicket}));
  }

  return {
    ticket,
    handleInputChange,
    handleSubmit
  };
}

Ticket.propTypes = {
  enableDemo: PropTypes.bool.isRequired,
  instrument: PropTypes.object.isRequired,
  placeOrder: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired
};
