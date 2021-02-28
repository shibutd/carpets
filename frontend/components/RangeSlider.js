import { useEffect, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

import Slider, { useSlide } from './Slider'

const replaceComma = (word) => word.replace(',', '.')

Array.prototype.min = function() {
  return Math.min(...this)
}

Array.prototype.max = function() {
  return Math.max(...this)
}

function RangeSlider({ size, onChange }) {

  const getWidthAndLengthFromSizes = useMemo(() => {
    const [widthArray, lengthArray] = [[], []]

    size.forEach((x) => {
      const splitted = x.split('*')
      const [width, length] = [
        parseFloat(replaceComma(splitted[0])),
        parseFloat(replaceComma(splitted[1]))
      ]
      widthArray.push(width)
      lengthArray.push(length)
    })

    return {
      minWidth: widthArray.min(),
      maxWidth: widthArray.max(),
      minLength: lengthArray.min(),
      maxLength: lengthArray.max()
    }
  }, size)

  const {
    minWidth,
    maxWidth,
    minLength,
    maxLength
  } = getWidthAndLengthFromSizes

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

export default memo(RangeSlider)

RangeSlider.propTypes = {
  size: PropTypes.array,
  onChange: PropTypes.func,
}