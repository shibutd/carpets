import React from 'react'

import PropTypes from 'prop-types'

function Checkbox({ label, isSelected, onCheckboxChange }) {
  return (
    <form className="form--checkbox">
      <label className="form-label">
        <input
          className="form-input"
          name={label}
          type="checkbox"
          checked={isSelected}
          onChange={onCheckboxChange}
        />
        <span className="checkmark-square"></span>
        {label}
      </label>
    </form>
  )
}

export default React.memo(Checkbox)

Checkbox.propTypes = {
  label: PropTypes.string,
  isSelected: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
}