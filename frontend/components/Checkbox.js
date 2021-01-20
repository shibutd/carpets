import React from 'react'

import PropTypes from 'prop-types'

function Checkbox({ label, isSelected, onCheckboxChange }) {
  return (
    <div className="category-sidebar-checkbox">
      <input
        id={label}
        name={label}
        type="checkbox"
        checked={isSelected}
        onChange={onCheckboxChange}
      />
      <label htmlFor={label}>
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