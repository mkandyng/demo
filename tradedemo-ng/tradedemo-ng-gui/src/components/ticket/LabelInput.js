import React from "react";

export default function LabelInput(props) {
    return (
      <p style={props.style}>
          <label>{props.label}:
               <input id={props.id}
                      type={props.type}
                      name={props.name}
                      step={props.step}
                      onChange={props.handleOnChange}
                      value={props.value} />
          </label>
      </p>
   )
}
