import React from "react";

export default function LabelInput(props) {
    const { id,
            label,
            style,
            type,
            name,
            step,
            value,
            handleOnChange } = props;
    return (
      <p style={style}>
          <label>{label}:
               <input id={id}
                      type={type}
                      name={name}
                      step={step}
                      onChange={handleOnChange}
                      value={value || ""} />
          </label>
      </p>
   )
}
