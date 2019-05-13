import React, { Component } from "react";
import ReactAutocomplete from "react-autocomplete";
import { addInstrumentToMarketfeed,
         addMarketfeedInstruments,
         selectMarketfeedInstrument,
         flashPriceUpdate } from "../../../libs/marketfeed";
/**
 * This class encapsulate the functionalities of:
 * 1) Select and add instrument to the marketfeed
 * 2) Simulate Market data movements
 * 3) Retrieve intraday and daily time series
 */
class InstrumentSearch extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.selectDisplayInstruments = this.selectDisplayInstruments.bind(this);
	this.populateMarketfeed = this.populateMarketfeed.bind(this);
    }

    componentDidMount() {
        this.props.fetchInstruments();
	this.populateMarketfeed();
    }
    
    populateMarketfeed() {
        if(this.props.marketfeedInstruments.length === 0) {
            let isAddedToMarketfeed = false;
            const interval = setInterval(() => {
                if(this.props.instruments.length >= this.props.maxMarketfeedInstruments) {
                    if(!isAddedToMarketfeed) {
                        isAddedToMarketfeed = true;
                        addMarketfeedInstruments(this.props);
			// Call it a couple of times to generate more price movements
                        setInterval(() => {
                        	flashPriceUpdate(this.props.marketfeedInstruments, this.props.updateInstrumentToMarketfeed);
                        }, 1000);
                    }
                    if(this.props.marketfeedInstruments.length > 0) {
			const selectedIndex = 0;
                        if(selectMarketfeedInstrument(this.props, this.props.marketfeedInstruments[selectedIndex].symbol, selectedIndex)) {
                            clearInterval(interval);
                        }
                    }
                }
            }, 1000);
        }
    }

    onChange(e) {
  	this.setState({
            value: e.target.value
        });
    }

    onSelect(val){
        this.setState({
            value: val
        });
    }

    renderItem(item, highlighted){
        return (
	    <div key={item.id} style={{ backgroundColor: highlighted?"#eee":"transparent"}} >
            	{item.label}
            </div>
        ); 
    }

    getItemValue(item){
        return `${item.value}`;
    }

    matchStocks(state, value) {
	return (state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    selectDisplayInstruments(instruments) {
	let maxRecords = 10;
	return instruments.slice(0, maxRecords)
		   .map(instrument => {
			const symbol = instrument.symbol;
                	const name = instrument.name;
                	return {
                    		value: symbol,
                    		label: "(" + symbol +  ") " +  name
                	}
	});
    }

    addItem(event) {
    	event.preventDefault();
    	const selectedValue = this.state.value;
        if(addInstrumentToMarketfeed(this.props, selectedValue)) {
	    const interval = setInterval(() => {
		const selectedIndex = 0;
                if(selectMarketfeedInstrument(this.props, selectedValue, selectedIndex)) {
                    clearInterval(interval);
                }
            },500);
	    this.setState({value: ""});
	}
    }

    render() {
        return (
	    <div id="instrumentSearch">
		<form>
      		    <ReactAutocomplete
        		items={this.selectDisplayInstruments(this.props.instruments)}
                        getItemValue={this.getItemValue}
			shouldItemRender={this.matchStocks}
                        renderItem={this.renderItem}
        		value={this.state.value}
        		onChange={this.onChange}
        		onSelect={this.onSelect} />
		    <input type="submit" value="Add" onClick={this.addItem}/>
		</form>
            </div>
        )
    }
}

export default InstrumentSearch;
