import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import Checkbox from './Checkbox'
import RangeSlider from './RangeSlider'

const formatValue = value => {
  let newValue = ''
  if (Number.isInteger(value)) {
    newValue = newValue.concat(value.toString(), ',00')
  } else {
    newValue = newValue.concat(value.toString().replace('.', ','), '0')
  }
  return newValue
}

export default function CategorySidebar({
  properties,
  onChange,
  toggleShowFilters
}) {
  const { manufacturer, material, size } = properties
  // Key for rerendering slider - when we need to reset values
  const [rangeSliderKey, setRangeSliderKey] = useState(1)

  // Check if we use checkboxes or sliders for sizes
  const useCheckboxForSize = (size && size[0].includes('*')) ? false : true
  // Checkboxes values

  const [checkboxes, setCheckboxes] = useState(() => {
    let checkboxArray = []
    Object.entries(properties).forEach(([k, v]) => {
      v.forEach(x =>
        checkboxArray.push({ type: k, name: x, value: false })
      )
    })
    return checkboxArray
  })

  // Range Slider values
  const [ranges, setRanges] = useState([])

  const handleCheckboxChange = useCallback((e) => {
    const name = e.target.name
    setCheckboxes(prev => prev.map((item) =>
      ((item.name === name) ? { ...item, value: !item.value } : item)
    ))
  }, [])

  const handleRangeSliderChange = useCallback((sizes) => {
    const {
      sliderMinWidth,
      sliderMaxWidth,
      sliderMinLength,
      sliderMaxLength
    } = sizes

    const newRanges = [{
        type: 'width',
        name: `${formatValue(sliderMinWidth)}%${formatValue(sliderMaxWidth)}`,
        value: true
      },
      {
        type: 'length',
        name: `${formatValue(sliderMinLength)}%${formatValue(sliderMaxLength)}`,
        value: true
      },
    ]
    setRanges(newRanges)
  }, [])

  const createCheckbox = (option) => {
    const item = checkboxes.find((obj) => (obj.name === option))
    return <Checkbox
      label={option}
      isSelected={item.value}
      onCheckboxChange={handleCheckboxChange}
      key={option}
    />
  }

  const createCheckboxes = (options) => options.map(createCheckbox)

  const handleClearAllFilters = (e) => {
    e.preventDefault()
    setRangeSliderKey(prev => prev + 1)
    setCheckboxes(prev => prev.map(item => ({ ...item, value: false })))
  }

  useEffect(() => {
    onChange(checkboxes, ranges)
  }, [checkboxes, ranges])

  return (
    <>
      <h5>
        Фильтры
        <span
          id="filter-close"
          className="filter-toggle"
          onClick={toggleShowFilters}
        >
          Скрыть
        </span>
        <span
          id="filter-reset"
          className="filter-toggle"
          onClick={handleClearAllFilters}
        >
          Очистить
        </span>
      </h5>
      <div className="category-sidebar-properties">
        <p>Производители:</p>
          {createCheckboxes(manufacturer)}
        </div>
      <div className = "category-sidebar-properties">
        <p>Материалы:</p> { createCheckboxes(material) }
      </div>
      {useCheckboxForSize
        ? (
          <div className="category-sidebar-properties">
            <p>Размеры:</p>
            {createCheckboxes(size)}
          </div>
        ) : (
        <RangeSlider
          key={rangeSliderKey}
          size={size}
          onChange={handleRangeSliderChange}
        />
      )}
    </>
  )
}

CategorySidebar.propTypes = {
  properties: PropTypes.object,
  onChange: PropTypes.func,
  toggleShowFilters: PropTypes.func,
}