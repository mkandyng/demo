import React from "react";

export default function LabelTextArea(props) {
    const {
        label,
        name,
        maxLength,
        value,
        handleOnChange } = props;
    return (
      <p>
          <label>{label}
               <textarea
                 name={name}
                 maxLength={maxLength}
                 value={value}
                 onChange={handleOnChange}/>
          </label>
      </p>
   )
}
