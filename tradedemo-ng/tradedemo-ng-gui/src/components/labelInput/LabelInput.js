import React from "react";
import PropTypes from 'prop-types';

/**
 * [LabelInput Input box with Label wrapped with <p>]
 */
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

LabelInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    step: PropTypes.number,
    handleOnChange: PropTypes.func.isRequired
};
