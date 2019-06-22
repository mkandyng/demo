import React, { useState, useEffect } from "react";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import ReactAutocomplete from "react-autocomplete";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../../marketfeed/libs";
import { fetchInstruments } from "../../../modules/instruments/actions";
import { addInstrumentToMarketfeed } from "../../../modules/marketfeed/actions";
import "./instrumentSearch.css"

/**
 * Instruments container component
 */
export function InstrumentSearch(props) {

    const { instruments,
            marketfeed,
            addInstrumentToMarketfeed,
            fetchInstruments } = props;

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
      <div id="instrumentSearch">
           <form>
               <ReactAutocomplete
                   value={value}
                   onChange={eventHandler.handleChange}
                   onSelect={eventHandler.handleSelect}
                   items={eventHandler.updateSearchDropDown(instruments)}
                   getItemValue={eventHandler.getItemValue}
                   shouldItemRender={eventHandler.matchStocks}
                   renderItem={eventHandler.renderItem}
               />
             <input type="submit" value="Add" onClick={eventHandler.addItem}/>
           </form>
      </div>
    )
}


const mapStateToProps = state => ({ instruments: state.instruments,
                                    marketfeed: state.marketfeed,
                                  });

// Map Redux actions to component props
const mapDispatchToProps = dispatch =>
    bindActionCreators({
      addInstrumentToMarketfeed,
      fetchInstruments
    }, dispatch);

// The HOC
export default connect(mapStateToProps, mapDispatchToProps)(InstrumentSearch);
