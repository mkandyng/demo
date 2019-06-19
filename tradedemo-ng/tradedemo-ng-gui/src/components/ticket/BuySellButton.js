import React from "react";

export default function BuySellButton(props) {
    return (
        <div id={props.containerId} onClick={props.handleOnClick}>
             <label>{props.label}</label>
             <button id={props.id}>{props.buttonName}</button>
       </div>
   )
}
