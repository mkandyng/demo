import React from "react";
import ReactAutocomplete from "react-autocomplete";
import "./instrumentSearch.css"

/**
 * InstrumentSearch view component
 */
export default function InstrumentSearchView(props) {
    const { value,
            instruments,
            eventHandler } = props;
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
