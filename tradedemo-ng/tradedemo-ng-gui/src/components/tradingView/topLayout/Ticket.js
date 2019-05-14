import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { placeOrder } from "../../../store/actions/placeOrder";
import { updateOrder } from "../../../store/actions/updateOrder";
import { placeOrderAndGenerateTradeLifeCycle } from "../../../libs/orderbook.js"
import { getRandomInt, toggleOpacity, getDateString } from "../../../libs/utils";

class Ticket extends React.Component {
    constructor(props) {
    	super(props)
	this.state = {
		       symbol: undefined,
		       orderId:1,
		       quantity: 5,
		       orderType: "Market",
		       price: 0,
		       expiryType: "Day",
		       expiryDate: "",
		       note: "",
		       priceStyle: {opacity: "0.5"},
		       expiryDateStyle: {opacity: "0.5"}	
		     }
 	this.symbolChange = this.symbolChange.bind(this);
	this.orderTypeChange = this.orderTypeChange.bind(this);
	this.expiryTypeChange = this.expiryTypeChange.bind(this);
        this.expiryDateChange = this.expiryDateChange.bind(this);
        this.quantityChange = this.quantityChange.bind(this)
        this.priceChange = this.priceChange.bind(this);
	this.noteChange = this.noteChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
	this.validateAndPlaceOrder = this.validateAndPlaceOrder.bind(this);
    }

    componentDidMount() {
	const placeOrder = instrument => {
	    const placeInterval = setInterval(() => {
	        clearInterval(placeInterval);
		let buySell = getRandomInt(0,1) === 0 ? "Buy":"Sell";
		this.validateAndPlaceOrder(buySell, instrument, instrument.price, false);
	    }, getRandomInt(500,50000));
	};

	const interval = setInterval(() => {
	   const maxInstrumentsForDemo = 30;
	   if(this.props.marketfeedInstruments.length > 0) {
		clearInterval(interval);
		for(let i=0; i<maxInstrumentsForDemo; i++) {
		    this.props.marketfeedInstruments.forEach(instrument => {
			placeOrder(instrument);	
		    });
		}
	   }
	}, 300);
    }

    handleOnSubmit(e) {
	e.preventDefault();
   	const buySell = e.target.innerText;
	const instrument = this.props.marketfeedInstruments[this.props.selectedMarketfeedIndex];
	this.validateAndPlaceOrder(buySell, instrument, Number(this.state.price), true);
    }

    validateAndPlaceOrder(buySell, instrument, price, confirmOrder) {
        const validateOrder = () => {
	    if(this.state.quantity === 0) {
	        alert("Quantity must be greater than 0");
		return false;
	    }
            if(this.state.expiryType === "GTD") {
		var today = new Date();
		today.setHours(1,0,0,0);
		var inputDate = new Date(this.state.expiryDate);
		if(inputDate < today) {
		    alert("GTD date must be greater or equals to today [" + getDateString(today, "dateOnly") + "]");
		    return false;
		}
	    }
	    if(this.state.orderType !== "Market") {
	        const instrument = this.props.marketfeedInstruments[this.props.selectedMarketfeedIndex];
		if(Math.abs(this.state.price - instrument.price) > (instrument.price * 0.05)) {
		    alert("Price " + this.state.price + " is outside 5% of midPrice [" + instrument.price.toFixed(2) + "]");
		    return false;
		} 
	    }
	    return true;
	}
	if(validateOrder()) {
	    const priceInfo = this.state.orderType === "Market" ? "Market price": this.state.orderType + " (" + this.state.price + ")"; 
	    let confirmedPlaceOrder = true;
	    if(confirmOrder) {
	        //eslint-disable-next-line
		confirmedPlaceOrder = confirm(buySell + " " + this.state.quantity + " " + instrument.name + " @ " + priceInfo);
	    }
	    
	    if(confirmedPlaceOrder) {
	    	const padDigits = function(number, digits) {
    		    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
	    	}
		placeOrderAndGenerateTradeLifeCycle(this.props, {
				    	orderRef:"XA"+ padDigits(this.state.orderId, 8),
				    	symbol:instrument.symbol,
					instrument: instrument.name,
					ccy: instrument.currency,
					buySell: buySell,
					expiryType: this.state.expiryType,
					expiryDate: this.state.expiryDate,
				        orderType: this.state.orderType,
					price: this.state.orderType === "Market" ? "": price,
					quantity: this.state.quantity,
					note: this.state.note,
					executed: 0,
					midPrice: instrument.price   
				    });
	        this.setState({orderId: this.state.orderId + 1});
	   }
	}
    }
   
    symbolChange(e) {
	this.setState( {
	    price: this.props.marketfeedInstruments[this.props.selectedMarketfeedIndex].price.toFixed(2)
	});
    }

    orderTypeChange(e) {
	this.setState({
	    priceStyle: {opacity: toggleOpacity(e.target.value, "Market", true)},
	    orderType: e.target.value,
	    price: this.props.marketfeedInstruments[this.props.selectedMarketfeedIndex].price.toFixed(2)
	});
    }

    expiryTypeChange(e) {
	this.setState({
	    expiryDateStyle: {opacity: toggleOpacity(e.target.value, "GTD", false)},
	    expiryType: e.target.value,
	    expiryDate: e.target.value === "GTD"?getDateString(new Date(), "dateOnly"):""
	});
    }

    expiryDateChange(e) {
	this.setState({
	    expiryDate: e.target.value
	});
    }
    
    quantityChange(e) {
	this.setState({
	    quantity: e.target.value
	});
    }
    
    priceChange(e) {
	this.setState({
            price: e.target.value
        });
    }

    noteChange(e) {
	this.setState({
            note: e.target.value
        });
    }

    render() {
    	const {marketfeedInstruments, selectedMarketfeedIndex} = this.props;
	let symbol = "";
	let bidPrice = null;
	let askPrice = null;
	let instrument = marketfeedInstruments[selectedMarketfeedIndex];

	if(instrument !== undefined) {
		symbol = instrument.symbol;
		bidPrice = instrument.bidPrice;
		askPrice = instrument.askPrice;
		if(this.state.symbol !== symbol) {
		    this.setState({symbol: symbol, price: instrument.price.toFixed(2)});
		}
	}
    return (
        <div id="ticket">
            <form>
		<p>
		    <label>Symbol:
			<input type="text" 
			       name="symbol" 
			       value={symbol}
			       onChange={this.symbolChange}/>
		    </label>
		</p>
		<p>
                    <label>Quantity:
			<input type="number" 
			       name="quantity" 
			       step="5" 
			       onChange={this.quantityChange} 
			       value={this.state.quantity} />
		    </label>
                </p>
		<p>
                    <label>Order Type:
		        <select id="orderType" name="order_type" onChange={this.orderTypeChange}>
			    <option value="Market">Market</option>
			    <option value="Limit">Limit</option>
			    <option value="Stop">Stop</option>
			    <option value="Stop Limit" >Stop Limit</option>
			</select>
		    </label> 
		</p>
		<p style={this.state.priceStyle}>
		    <label>Price:
		        <input type="number" 
			       name="price" 
			       step="0.1" 
			       onChange={this.priceChange} 
			       value={this.state.price} />
		    </label>
		</p>
		<p>
		    <label>ExpiryType:
		        <select name="expiryType" onChange={this.expiryTypeChange}>
		            <option value="Day">Day</option>
		            <option value="GTD">GTD</option>
		            <option value="GTC">GTC</option>
		            <option value="FOK">FOK</option>
		        </select>
                    </label> 
		</p>
                <p style={this.state.expiryDateStyle}>
		    <label>Expiry Date:
			<input type="date" 
				     name="expiryDate" 
				     onChange={this.expiryDateChange} 
				     value={this.state.expiryDate}/>
		    </label>
  		</p>
		<p>
                    <label>Note
			<textarea name="note" maxLength="100" onChange={this.noteChange} value={this.state.note}></textarea>
		    </label>
		</p>
		<div>
                    <div id="buySell">
		        <div id="sellButton" onClick={this.handleOnSubmit}>
			    <label>{bidPrice}</label>
			    <button id="buy">Sell</button>
                        </div>
                        <div id="buyButton" onClick={this.handleOnSubmit}>
			    <label>{askPrice}</label>
			    <button id="sell">Buy</button>
		        </div>
                    </div>
		</div>
	   </form>
	</div>
    )
    }
}
 
const mapStateToProps = state => ({ ...state });
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


