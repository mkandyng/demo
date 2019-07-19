import React from "react";
import PropTypes from 'prop-types';

/**
 * Drop down with label wrapped with <p>
 */
export default function SelectionDropDown({
  id,
  label,
  name,
  list,
  value,
  handleOnChange
}) {
  return (<p>
    <label>{label}:
      <select id={id} name={name} onChange={handleOnChange} value={value}>
        {list.map((val) => <option key={name + val} id={name + value} value={value}>{val}</option>)}
      </select>
    </label>
  </p>)
}

SelectionDropDown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleOnChange: PropTypes.func.isRequired
};
