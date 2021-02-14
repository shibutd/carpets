import React from 'react'

import PropTypes from 'prop-types'

function Checkbox({ label, isSelected, onCheckboxChange }) {
  return (
    <div className="category-sidebar-checkbox">
      <label>
        <input
          name={label}
          type="checkbox"
          checked={isSelected}
          onChange={onCheckboxChange}
        />
        <span className="checkmark-square"></span>
        {label}
      </label>
    </div>
  )
}

export default React.memo(Checkbox)

Checkbox.propTypes = {
  label: PropTypes.string,
  isSelected: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
}