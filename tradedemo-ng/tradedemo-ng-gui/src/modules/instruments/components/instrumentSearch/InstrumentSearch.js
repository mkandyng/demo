import React, { useState, useEffect } from "react";
import ReactAutocomplete from "react-autocomplete";
import { MAX_MARKET_FEED_INSTRUMENTS } from "../../../../libs/marketfeed";
import "./instrumentSearch.css"

/**
 * Component for InstrumentSearch drop down, which manage the instruments state
 */
export default function InstrumentSearch({ instruments,
                                           marketfeedInstruments,
                                           addInstrumentToMarketfeed,
                                           fetchInstruments }) {

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
          if(marketfeedInstruments.length >= MAX_MARKET_FEED_INSTRUMENTS) {
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

    return (
      <div id="instrumentSearch">
           <form>
               <ReactAutocomplete
                   value={value}
                   onChange={handleChange}
                   onSelect={handleSelect}
                   items={updateSearchDropDown(instruments)}
                   getItemValue={getItemValue}
                   shouldItemRender={matchStocks}
                   renderItem={renderItem}
               />
             <input type="submit" value="Add" onClick={addItem}/>
           </form>
      </div>
    )
}
