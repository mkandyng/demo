import React, { useState, useEffect } from "react";
import ReactAutocomplete from "react-autocomplete";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../index";
import PropTypes from 'prop-types';
import "./instrumentsSearch.css"

/**
 * Component for InstrumentSearch drop down, which manage the instruments state
 */
export default function InstrumentsSearch({ instruments,
                                            marketfeedInstruments,
                                            addInstrumentToMarketfeed,
                                            fetchInstruments }) {

    const [ value, setSelectItem ] = useState("");

    useEffect(() => {
        fetchInstruments();
    }, [ fetchInstruments ]);

    return (
      <div id="instrumentsSearch">
           <form>
               <ReactAutocomplete
                   value={value}
                   onChange={event => setSelectItem(event.target.value)}
                   onSelect={value => setSelectItem(value)}
                   items={updateSearchDropDown(instruments)}
                   getItemValue={item => `${item.value}`}
                   shouldItemRender={matchStocks}
                   renderItem={renderItem}
               />
               <input type="submit" value="Add" onClick={event => addItem(event,
                                                                          value,
                                                                          instruments,
                                                                          marketfeedInstruments,
                                                                          addInstrumentToMarketfeed,
                                                                          setSelectItem)}/>
           </form>
      </div>
    )
}

function updateSearchDropDown(instruments) {
   const MAX_RECORDS = 10;
   return instruments.slice(0, MAX_RECORDS)
                     .map(instrument => ({
                         value: instrument.symbol,
                         label: "(" + instrument.symbol +  ") " +  instrument.name
                     }));
};

function addItem(event,
                 value,
                 instruments,
                 marketfeedInstruments,
                 addInstrumentToMarketfeed,
                 setSelectItem) {

    const addSelectedInstrumentToMarketfeed = () => {
        const instrument = instruments.find(inst => inst.symbol === value);
        if(instrument !== undefined) {
            if(marketfeedInstruments.length >= MAX_MARKET_FEED_INSTRUMENTS) {
                alert("Max " + MAX_MARKET_FEED_INSTRUMENTS + " instruments, please remove an one to add [" + value + "]");
            } else {
                addInstrumentToMarketfeed(instrument);
                return true;
            }
        } else {
            alert("[" + value + "] is not a valid, unable to add to marketfeed");
        }
            return false;
    };

    event.preventDefault();
    setSelectItem("");
    addSelectedInstrumentToMarketfeed();
};

function renderItem(item, highlighted) {
    return (
      <div key={item.id} style={{ backgroundColor: highlighted?"#eee":"transparent"}} >
        {item.label}
      </div>
    );
}

function matchStocks(state, value) {
      return state.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}

InstrumentsSearch.propTypes = {
    marketfeedInstruments: PropTypes.arrayOf(PropTypes.object).isRequired,
    instruments: PropTypes.arrayOf(PropTypes.object).isRequired,
    addInstrumentToMarketfeed: PropTypes.func.isRequired,
    fetchInstruments: PropTypes.func.isRequired
};
