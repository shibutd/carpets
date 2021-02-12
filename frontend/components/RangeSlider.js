import { useEffect } from 'react'
import PropTypes from 'prop-types'

import Slider, { useSlide } from './Slider'

export default function RangeSlider({ size, onChange }) {
  let minWidth, maxWidth, minLength, maxLength
  const replaceComma = (word) => word.replace(',', '.')

  size.forEach((x) => {
    const splitted = x.split('*')
    const [width, length] = [
      parseFloat(replaceComma(splitted[0])),
      parseFloat(replaceComma(splitted[1]))
    ]
    if (minWidth === undefined || minWidth > width) {
      minWidth = width
    }
    if (maxWidth === undefined || maxWidth < width) {
      maxWidth = width
    }
    if (minLength === undefined || minLength > length) {
      minLength = length
    }
    if (maxLength === undefined || maxLength < length) {
      maxLength = length
    }
  })

  const [sliderMinWidth, sliderMaxWidth, sliderWidthConfig] = useSlide({
      min: minWidth,
      max: maxWidth,
      step: 0.1,
      label: "Ширина"
    },
    [sliderMinWidth, sliderMaxWidth]
  )
  const [sliderMinLength, sliderMaxLength, sliderLengthConfig] = useSlide({
      min: minLength,
      max: maxLength,
      step: 0.1,
      label: "Длина"
    },
    [sliderMinLength, sliderMaxLength]
  )

  useEffect(() => {
    onChange({
      sliderMinWidth,
      sliderMaxWidth,
      sliderMinLength,
      sliderMaxLength
    })
  }, [sliderMinWidth, sliderMaxWidth, sliderMinLength, sliderMaxLength])

  return (
    <>
      <div className="category-sidebar-properties">
        <p>Ширина, м:</p>
        <Slider {...sliderWidthConfig} />
      </div>
      <div className = "category-sidebar-properties" >
        <p>Длина, м:</p>
        <Slider { ...sliderLengthConfig } />
      </div>
    </>
  )
}

RangeSlider.propTypes = {
  size: PropTypes.array,
  onChange: PropTypes.func,
}