import React from "react";

export default function LabelTextArea(props) {
    return (
      <p>
          <label>{props.label}
               <textarea
                 name={props.name}
                 maxLength={props.maxLength}
                 onChange={props.handleOnChange}
                 value={props.value}/>
          </label>
      </p>
   )
}
