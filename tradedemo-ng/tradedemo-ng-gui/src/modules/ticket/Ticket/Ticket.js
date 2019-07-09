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
 * This component is not a pure function because ticket keep track of its own state
 *
 */

class Ticket extends React.Component {

    constructor(props) {
        super(props);
        this.state = { symbol: undefined,
                       orderId:0,
                       quantity: 5,
                       orderType: "Market",
                       price: 0,
                       expiryType: "Day",
                       expiryDate: "",
                       note: "",
                       priceStyle: {opacity: "0.5"},
                       expiryDateStyle: {opacity: "0.5"} };

        this.eventHandler = {
            handleFormChange: e => { const { name, value } = e.target;
                                     this.setState({[name] : value}) },
            orderTypeChange:  (e, instrument) => this.setState({
                      priceStyle: {opacity: toggleOpacity(e.target.value, "Market", true)},
                      orderType: e.target.value}),
            expiryTypeChange: e => this.setState({
                      expiryDateStyle: {opacity: toggleOpacity(e.target.value, "GTD", false)},
                      expiryType: e.target.value,
                      expiryDate: e.target.value === "GTD"?getDateString(new Date(), "dateOnly"):""}),
            handleOnSubmit: (e, ticket, instrument) => {
                      e.preventDefault();
                      const buySell = e.target.innerText;
                      if(submitTicket({ ticket: ticket,
                                        instrument: instrument,
                                        buySell:buySell,
                                        confirmOrder: true,
                                        placeOrder: this.props.placeOrder,
                                        updateOrder: this.props.updateOrder})) {
                          this.setState({orderId: ticket.orderId+1});
                      }
             }
         };
     }

     componentDidMount() {
         const MAX_ORDER_COUNT = 10;
         const interval = setInterval(() => {
             if(this.props.enableDemo && this.state.orderId < MAX_ORDER_COUNT) {
                 let buySell = getRandomInt(0,1) === 0 ? "Buy":"Sell";
                 if(this.props.instrument.symbol && submitTicket({ ticket: this.state,
                                   instrument: this.props.instrument,
                                   buySell: buySell,
                                   confirmOrder: false,
                                   placeOrder: this.props.placeOrder,
                                   updateOrder: this.props.updateOrder })) {

                     this.setState({orderId: this.state.orderId+1});
                 }
             } else {
                clearInterval(interval);
             }
         }, getRandomInt(300,1000));
    }

    componentWillUpdate() {
        if(this.state.symbol !== this.props.instrument.symbol) {
            this.setState({ symbol: this.props.instrument.symbol,
                            price: this.props.instrument.price.toFixed(2) });
        }
    }

    render() {
        return (
            <TicketView ticket={this.state}
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
                            value={ticket.symbol}
                            handleOnChange={eventHandler.handleFormChange} />
                <LabelInput label="Quantity"
                            name="quantity"
                            type="number"
                            step={5}
                            value={ticket.quantity}
                            handleOnChange={eventHandler.handleFormChange} />
                <SelectionDropDown id="orderType"
                                   label="Order Type"
                                   name="orderType"
                                   list={["Market","Limit","Stop","Stop Limit"]}
                                   handleOnChange={ e => eventHandler.orderTypeChange(e,instrument) } />
                <LabelInput style={ticket.priceStyle}
                            label="Price"
                            name="price"
                            type="number"
                            step={0.1}
                            value={ticket.price}
                            handleOnChange={eventHandler.handleFormChange} />
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
                            handleOnChange={eventHandler.handleFormChange} />
                <LabelTextArea
                           label="Note"
                           name="note"
                           maxLength={100}
                           value={ticket.note}
                           handleOnChange={eventHandler.handleFormChange} />
                <div>
                    <div id="buySell">
                        <BuySellButton containerId="sellButton"
                                       handleOnClick={e => eventHandler.handleOnSubmit(e, ticket, instrument)}
                                       label={instrument.bidPrice}
                                       id="sell"
                                       buttonName="Sell" />
                        <BuySellButton containerId="buyButton"
                                       handleOnClick={e => eventHandler.handleOnSubmit(e, ticket, instrument)}
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
