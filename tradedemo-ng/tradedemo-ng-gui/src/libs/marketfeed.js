import React from "react";
import { getRandomInt } from "./utils";

export const generateMarketDataMovement = function(instrument) {
  let calNewPrice = (price,margin,chg) => {
     if(chg > 10) {
        return price-margin;
     } else if(chg < 10) {
        return price+margin;
     } else {
        return Math.round(Math.random()) === 0?price-margin:price+margin;
     }
  };

  let upDownPrice = (price, previousPrice, data) => {
     let priceUpDown = "priceUp";
     if(price < previousPrice) {
        priceUpDown = "priceDown";
     }
     return <span className={priceUpDown}>{data}</span>;
  };

  // generate a random margin
  let margin = instrument.price * (0.001 * getRandomInt(10,10));
  let bidAskMargin = instrument.price * (0.001 * getRandomInt(1,10));
  let newPrice = calNewPrice(instrument.price,margin);
  let chg = (((newPrice - instrument.open)/instrument.open) * 100).toFixed(2);
  let bid = (newPrice - bidAskMargin).toFixed(2);
  let ask = (newPrice + bidAskMargin).toFixed(2);
  let open = instrument.open * 1.0;
  let last = instrument.price * 1.0;

  return {
      delete:<img src="img/delete.png"
                width="15"
                height="15"
                alt="delete" />,
      price: newPrice,
      bidPrice: bid,
      askPrice: ask,
      symbol: instrument.symbol,
      name: instrument.name,
      currency: instrument.currency,
      last: last.toFixed(2),
      open: open.toFixed(2),
      bid: upDownPrice(newPrice, open, bid),
      ask: upDownPrice(newPrice, open, ask),
      chg: upDownPrice(newPrice, open, chg + "%")
    };
};

export const selectMarketfeedInstrument = function(props, symbol, index) {
    const matchedInstrument = props.marketfeedInstruments.find(e => e.symbol === symbol);
    if(matchedInstrument !== undefined) {
        props.selectInstrumentToMarketfeed(index);
        props.fetchInstrumentIntradayTimeSeries(matchedInstrument);
        props.fetchInstrumentDailyTimeSeries(matchedInstrument);
        return true;
    }
    return false;
};

export const addInstrumentToMarketfeed = function(props, symbol) {
    const instrument = props.instruments.find(e => e.symbol === symbol);
    if(instrument !== undefined) {
        const maxInstrument = props.maxMarketfeedInstruments;
        if(props.marketfeedInstruments.length >= maxInstrument) {
            alert("Max " + maxInstrument + " instruments, please remove an one to add [" + symbol + "]");
        } else {
            props.addInstrumentToMarketfeed(instrument);
            return true;
        }
    } else {
       alert("[" + symbol + "] is not a valid, please select from dropdown only");
    }
    return false;
};

export const flashPriceUpdate = function(marketfeedInstruments, updateInstrumentToMarketfeed) {
    const flashCount = 2;
    const instrumentIndex = getRandomInt(0,marketfeedInstruments.length);
    const randomInstrument = marketfeedInstruments[instrumentIndex];
    if(randomInstrument !== undefined) {
        const generatedInstrument = generateMarketDataMovement(randomInstrument);
        if(generatedInstrument.open !== undefined) {
            let counter = 0;
            const flashInterval = setInterval(() => {
                counter++;
                let instrumentPrice = generatedInstrument;
                if(counter === flashCount) {
                    clearInterval(flashInterval);
                } else {
                    if((counter % flashCount) !== 0) {
                        instrumentPrice = {...instrumentPrice, bid:"", ask:"" };
                    }
                }
                updateInstrumentToMarketfeed(instrumentPrice);
            }, 500);
        }
    }
};

export const addMarketfeedInstruments = (props) => {
    props.instruments
         .slice(0, props.maxMarketfeedInstruments)
         .forEach(instrument => {
            props.addInstrumentToMarketfeed(instrument);
            console.log(instrument);
         }
    );
};
