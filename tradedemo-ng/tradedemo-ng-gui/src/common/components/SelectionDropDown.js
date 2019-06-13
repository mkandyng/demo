import React from "react";

export default function SelectionDropDown(props) {
    return (
      <p>
         <label>{props.label}:
              <select id={props.id} name={props.name} onChange={props.handleOnChange}>
                {props.list.map((value) => <option id={props.name+value} value={value}>{value}</option>)}
              </select>
         </label>
     </p>
   )
}
