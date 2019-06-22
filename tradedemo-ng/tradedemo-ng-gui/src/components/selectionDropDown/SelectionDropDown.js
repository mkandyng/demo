import React from "react";

export default function SelectionDropDown(props) {
    const { id,
            label,
            name,
            list,
            handleOnChange } = props;
    return (
      <p>
         <label>{label}:
              <select id={id} name={name} onChange={handleOnChange}>
                {list.map((value) => <option key={name+value} id={name+value} value={value}>{value}</option>)}
              </select>
         </label>
     </p>
   )
}
