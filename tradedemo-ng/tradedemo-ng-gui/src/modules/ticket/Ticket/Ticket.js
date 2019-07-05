import React from "react";
import { getRandomInt, toggleOpacity, getDateString } from "../../../libs/utils";
import BuySellButton from "../../../components/BuySellButton";
import LabelInput from "../../../components/LabelInput";
import LabelTextArea from "../../../components/LabelTextArea";
import SelectionDropDown from "../../../components/SelectionDropDown";
import submitTicket from "../submitTicket";
import "./ticket.css";

/**
 * 
 * [Ticket Component to handle ticket view and interaction]
 * This component is not a pure function because ticket keep changing due
 * market data so the function would get call all the time and create
 * unnesscary performance hit on creating eventHandler and check to automatically
 * place order
 *
 */

class Ticket extends React.PureComponent {

    constructor(props) {
        super(props);
        this.eventHandler = {
            symbolChange:     e => this.props.updateTicket({price: this.props.instrument.price.toFixed(2)}),
            expiryDateChange: e => this.props.updateTicket({expiryDate: e.target.value}),
            quantityChange:   e => this.props.updateTicket({quantity: e.target.value}),
            priceChange:      e => this.props.updateTicket({price: e.target.value}),
            noteChange:       e => this.props.updateTicket({note: e.target.value}),
            orderTypeChange:  e => this.props.updateTicket({
                      priceStyle: {opacity: toggleOpacity(e.target.value, "Market", true)},
                      orderType: e.target.value,
                      price: this.props.instrument.price.toFixed(2)}),
            expiryTypeChange: e => this.props.updateTicket({
                      expiryDateStyle: {opacity: toggleOpacity(e.target.value, "GTD", false)},
                      expiryType: e.target.value,
                      expiryDate: e.target.value === "GTD"?getDateString(new Date(), "dateOnly"):""}),
            handleOnSubmit:   e => {
                      e.preventDefault();
                      const buySell = e.target.innerText;
                      if(submitTicket({ ticket:this.props.ticket,
                                         instrument:this.props.instrument,
                                         buySell:buySell,
                                         confirmOrder: true,
                                         placeOrder: this.props.placeOrder,
                                         updateOrder: this.props.updateOrder})) {
                          this.props.updateTicket({orderId: this.props.ticket.orderId+1});
                      }
             }
         };
     }

     componentDidMount() {
         const MAX_ORDER_COUNT = 10;
         const interval = setInterval(() => {
             if(this.props.enableDemo && this.props.ticket.orderId < MAX_ORDER_COUNT) {
                 let buySell = getRandomInt(0,1) === 0 ? "Buy":"Sell";
                 if(this.props.instrument.symbol && submitTicket({ ticket: this.props.ticket,
                                   instrument: this.props.instrument,
                                   buySell: buySell,
                                   confirmOrder: false,
                                   placeOrder: this.props.placeOrder,
                                   updateOrder: this.props.updateOrder })) {
                     this.props.updateTicket({...this.props.ticket,
                                              orderId: this.props.ticket.orderId+1});
                 }
             } else {
                clearInterval(interval);
             }
         }, getRandomInt(300,1000));
     }

     render() {
         return (
             <TicketView ticket={this.props.ticket}
                         instrument={this.props.instrument}
                         eventHandler={this.eventHandler} />
         );
     }
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

export default Ticket;
