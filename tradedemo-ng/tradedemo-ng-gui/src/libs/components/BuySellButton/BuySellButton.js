import React from "react";
import PropTypes from 'prop-types';

/**
 * [BuySellButton Buy and Sell buttons with Label displaying buy/sell prices]
 */
export default function BuySellButton(props) {
    const { id,
            containerId,
            label,
            buttonName,
            handleOnClick } = props;
    return (
        <div id={containerId} onClick={handleOnClick}>
               <label>{label}</label>
               <button id={id}>{buttonName}</button>
         </div>
   )
}

BuySellButton.propTypes = {
    id: PropTypes.string.isRequired,
    containerId: PropTypes.string.isRequired,
    label: PropTypes.string,
    buttonName: PropTypes.string.isRequired,
    handleOnClick: PropTypes.func.isRequired
};
