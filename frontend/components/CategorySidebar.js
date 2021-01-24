import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import Checkbox from './Checkbox'
import RangeSlider from './RangeSlider'

export default function CategorySidebar({ properties, onChange }) {
  const { manufacturer, material, size } = properties
  // Check if we use checkboxes or sliders for sizes
  const useCheckboxForSize = (size && size[0].includes('*')) ? false : true

  // Checkboxes values
  const [checkboxes, setCheckboxes] = useState(() => {
    const propertiesCopy = { ...properties }
    if (useCheckboxForSize) {
      delete propertiesCopy.size
    }
    let checkboxArray = []

    Object.entries(properties).forEach(([k, v]) => {
      v.forEach((x) => checkboxArray.push({ type: k, name: x, value: false }))
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

    const formatValue = (value) => {
      let newValue = ''
      if (Number.isInteger(value)) {
        newValue = newValue.concat(value.toString(), ',00')
      } else {
        newValue = newValue.concat(value.toString().replace('.', ','), '0')
      }
      return newValue
    }

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

  useEffect(() => {
    onChange(checkboxes, ranges)
  }, [checkboxes, ranges])

  return (
    <>
      <h5>Фильтры</h5>
      <form>
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
        <RangeSlider size={size} onChange={handleRangeSliderChange} />
      )}
      </form>
    </>
  )
}

CategorySidebar.propTypes = {
  properties: PropTypes.object,
  onChange: PropTypes.func,
}