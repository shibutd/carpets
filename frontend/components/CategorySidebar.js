import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import Checkbox from './Checkbox'
import Slider, { useSlide } from './Slider'

export default function CategorySidebar({ properties, onChange }) {
  const { manufacturer, material, size } = properties
  // Check if we use checkboxes or sliders for sizes
  const useCheckboxForSize = (size && size[0].includes('*')) ? false : true

  // Checkboxes
  const [checkboxes, setCheckboxes] = useState(() => {
    const propertiesCopy = { ...properties }
    if (useCheckboxForSize) { delete propertiesCopy.size }
    let checkboxArray = []
    Object.entries(properties).forEach(([k, v]) => {
      v.forEach((x) => checkboxArray.push({ type: k, name: x, value: false }))
    })
    return checkboxArray
  })

  // Sliders
  const [sliderWidth, sliderWidthConfig] = useSlide({
      min: 0,
      max: 3,
      value: 0,
      step: 0.1,
      label: "Ширина"
    },
    [sliderWidth]
  )
  const [sliderLength, sliderLengthConfig] = useSlide({
      min: 0,
      max: 3,
      value: 0,
      step: 0.1,
      label: "Длина"
    },
    [sliderLength]
  )

  const createCheckbox = useCallback(
    option => {
      const item = checkboxes.find((obj) => (
        obj.name === option
      ))
      return <Checkbox
        label={option}
        isSelected={item.value}
        onCheckboxChange={handleCheckboxChange}
        key={option}
      />
    },
    [checkboxes],
  )

  const createCheckboxes = (options) => options.map(createCheckbox)

  const handleCheckboxChange = (e) => {
    const { name } = e.target
    setCheckboxes(prev => prev.map((item) => {
      return (item.name === name) ? { ...item, value: !item.value} : item
    }))
  }

  useEffect(() => {
    onChange(checkboxes)
  }, [checkboxes])

  return (
    <>
      <h5>Фильтры</h5>
      <form>
        <div className="category-sidebar-properties">
          <p>Производители:</p>
          {createCheckboxes(manufacturer)}
        </div>
        <div className="category-sidebar-properties">
          <p>Материалы:</p>
          {createCheckboxes(material)}
        </div>
        {useCheckboxForSize ? (
          <div className="category-sidebar-properties">
            <p>Размеры:</p>
            {createCheckboxes(size)}
          </div>
        ) : (
          <div className="category-sidebar-properties">
            <p>Ширина:</p>
            <Slider {...sliderWidthConfig} />

            <p>Длина:</p>
            <Slider {...sliderLengthConfig} />
          </div>
        )}
      </form>
    </>
  )
}

CategorySidebar.propTypes = {
  properties: PropTypes.object,
  onChange: PropTypes.func,
}