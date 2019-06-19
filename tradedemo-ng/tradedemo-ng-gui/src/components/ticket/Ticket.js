import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { placeOrderAndGenerateTradeLifeCycle } from "../../common/libs/orderbook"
import { getRandomInt, toggleOpacity, getDateString } from "../../common/libs/utils";
import { placeOrder, updateOrder } from "../../store/orderbook/orderbookActions"
import TicketView from "./TicketView";

function Ticket(props) {
    const { instrument,
            placeOrder,
            updateOrder } = props;

    const [ticket, updateTicket] = useState( {
        symbol: undefined,
        orderId:0,
        quantity: 5,
        orderType: "Market",
        price: 0,
        expiryType: "Day",
        expiryDate: "",
        note: "",
        priceStyle: {opacity: "0.5"},
        expiryDateStyle: {opacity: "0.5"}
    })

    useEffect ( () => {
        const MAX_ORDER_COUNT = 10;
        if(instrument.symbol !== undefined && ticket.orderId < MAX_ORDER_COUNT) {
            let buySell = getRandomInt(0,1) === 0 ? "Buy":"Sell";
            if(validateAndPlaceOrder({ ticket: ticket,
                                       instrument: instrument,
                                       buySell: buySell,
                                       price: instrument.price,
                                       confirmOrder: false,
                                       placeOrder: placeOrder,
                                       updateOrder: updateOrder })) {
                updateTicket({...ticket, orderId: ticket.orderId+1});
            }
        }
    }, [instrument, ticket, placeOrder, updateOrder]);

    const eventHandler = {
        symbolChange: e => updateTicket({...ticket, price: instrument.price.toFixed(2)}),
        expiryDateChange: e => updateTicket({...ticket, expiryDate: e.target.value}),
        quantityChange: e => updateTicket({...ticket, price: e.target.value}),
        priceChange: e => updateTicket({...ticket, price: e.target.value}),
        noteChange: e => updateTicket({...ticket, note: e.target.value}),
        orderTypeChange: e => updateTicket({...ticket,
                  priceStyle: {opacity: toggleOpacity(e.target.value, "Market", true)},
                  orderType: e.target.value,
                  price: instrument.price.toFixed(2)}),
        expiryTypeChange: e => updateTicket({...ticket,
                  expiryDateStyle: {opacity: toggleOpacity(e.target.value, "GTD", false)},
                  expiryType: e.target.value,
                  expiryDate: e.target.value === "GTD"?getDateString(new Date(), "dateOnly"):""}),
        handleOnSubmit: e => {
                  e.preventDefault();
                  const buySell = e.target.innerText;
                  if(validateAndPlaceOrder({ticket:ticket,
                                            instrument:instrument,
                                            buySell:buySell,
                                            price: Number(ticket.price),
                                            confirmOrder: true,
                                            placeOrder: placeOrder,
                                            updateOrder: updateOrder})) {
                      updateTicket({...ticket, orderId: ticket.orderId+1});
                  }
        }
    };

    return (
      <TicketView ticket={ticket}
                  instrument={instrument}
                  eventHandler={eventHandler} />
    )
}

function validateAndPlaceOrder(props) {
    const { ticket,
            instrument,
            buySell,
            price,
            confirmOrder,
            placeOrder,
            updateOrder } = props;

    const validateOrder = () => {
        if(ticket.quantity === 0) {
            alert("Quantity must be greater than 0");
            return false;
        }

        if(ticket.expiryType === "GTD") {
            var today = new Date();
            today.setHours(1,0,0,0);
            var inputDate = new Date(ticket.expiryDate);
            if(inputDate < today) {
                alert("GTD date must be greater or equals to today [" + getDateString(today, "dateOnly") + "]");
                return false;
            }
        }

        if(ticket.orderType !== "Market") {
            if(Math.abs(ticket.price - instrument.price) > (instrument.price * 0.05)) {
                alert("Price " + ticket.price + " is outside 5% of midPrice [" + instrument.price.toFixed(2) + "]");
                return false;
            }
        }
        return true;
    }

    if(validateOrder()) {
        const priceInfo = ticket.orderType === "Market" ? "Market price": ticket.orderType + " (" + this.state.price + ")";
        let confirmedPlaceOrder = true;
        if(confirmOrder) {
            //eslint-disable-next-line
            confirmedPlaceOrder = confirm(buySell + " " + ticket.quantity + " " + instrument.name + " @ " + priceInfo);
        }

        if(confirmedPlaceOrder) {
            const padDigits = function(number, digits) {
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }

            placeOrderAndGenerateTradeLifeCycle({placeOrder, updateOrder}, {
                orderRef:"XA"+ padDigits(ticket.orderId, 8),
                executed: 0,
                buySell: buySell,
                symbol: instrument.symbol,
                instrument: instrument.name,
                ccy: instrument.currency,
                midPrice: instrument.price,
                expiryType: ticket.expiryType,
                expiryDate: ticket.expiryDate,
                orderType: ticket.orderType,
                price: ticket.orderType === "Market" ? "": price,
                quantity: ticket.quantity,
                note: ticket.note
            });
            return true;
        }
        return false;
    }
}

const mapStateToProps = state => ({ instrument: state.marketfeed.selected });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
     bindActionCreators({
        placeOrder,
        updateOrder
     }, dispatch);

// The HOC
export default connect(
     mapStateToProps,
     mapDispatchToProps
)(Ticket);
