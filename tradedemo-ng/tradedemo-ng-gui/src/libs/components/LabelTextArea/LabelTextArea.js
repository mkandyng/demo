import React from "react";
import PropTypes from 'prop-types';

/**
 * [LabelTextArea TextArea with Label wrapped by stylable <p>]
 */
export default function LabelTextArea(props) {
    const {
        id,
        label,
        name,
        maxLength,
        value,
        handleOnChange } = props;
    return (
      <p>
          <label>{label}
               <textarea
                   id={id}
                   name={name}
                   maxLength={maxLength}
                   value={value}
                   onChange={handleOnChange}/>
          </label>
      </p>
   )
}

LabelTextArea.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    handleOnChange: PropTypes.func.isRequired
};
