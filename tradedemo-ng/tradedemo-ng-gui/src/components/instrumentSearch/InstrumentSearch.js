import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../../common/libs/marketfeed";
import { fetchInstruments } from "../../store/instruments/instrumentsActions";
import { addInstrumentToMarketfeed } from "../../store/marketfeed/marketfeedActions";
import InstrumentSearchView from "./InstrumentSearchView"

/**
 * InstrumentSearch container component
 */
function InstrumentSearch(props) {

    const { instruments,
            marketfeed,
            fetchInstruments,
            addInstrumentToMarketfeed} = props;
    const [ value, setSelectItem ] = useState("");

    useEffect(() => {
        fetchInstruments();
    }, [ fetchInstruments ]);

    const handleChange = event => setSelectItem(event.target.value);

    const handleSelect = value => setSelectItem(value);

    const getItemValue = item => `${item.value}`;

    const matchStocks = (state, value) =>
          state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    const renderItem = (item, highlighted) => (
          <div key={item.id} style={{ backgroundColor: highlighted?"#eee":"transparent"}} >
            {item.label}
          </div>
    );

    const addItem = event => {
        event.preventDefault();
        addSelectedInstrumentToMarketfeed(value);
        setSelectItem("");
    };

    const addSelectedInstrumentToMarketfeed = symbol => {
       const instrument = instruments.find(inst => inst.symbol === symbol);
       if(instrument !== undefined) {
          if(marketfeed.instruments.length >= MAX_MARKET_FEED_INSTRUMENTS) {
               alert("Max " + MAX_MARKET_FEED_INSTRUMENTS + " instruments, please remove an one to add [" + symbol + "]");
          } else {
               addInstrumentToMarketfeed(instrument);
               return true;
          }
       } else {
          alert("[" + symbol + "] is not a valid, unable to add to marketfeed");
       }
       return false;
    };

    const updateSearchDropDown = instruments => {
       let maxRecords = 10;
       return instruments.slice(0, maxRecords)
                         .map(instrument => {
                              return {
                                  value: instrument.symbol,
                                  label: "(" + instrument.symbol +  ") " +  instrument.name
                              }
                         });
    };

    const eventHandler = {
        handleChange: handleChange,
        handleSelect: handleSelect,
        updateSearchDropDown: updateSearchDropDown,
        getItemValue: getItemValue,
        matchStocks: matchStocks,
        renderItem: renderItem,
        addItem: addItem
    }

    return (
        <InstrumentSearchView
                    value={value}
                    instruments={instruments}
                    eventHandler={eventHandler} />
    )
}

const mapStateToProps = state => ({ instruments: state.instruments,
                                    marketfeed: state.marketfeed});

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
        addInstrumentToMarketfeed,
        fetchInstruments,
    }, dispatch);

// The HOC
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InstrumentSearch);
