import { useEffect, useMemo, memo } from 'react'
import PropTypes from 'prop-types'

import Slider, { useSlide } from './Slider'

const replaceCommaWithDot = word => word.replace(',', '.')

function RangeSlider({ size, onChange }) {

  const getWidthAndLengthFromSizes = useMemo(() => {
    const [widthArray, lengthArray] = [[], []]

    size.forEach((x) => {
      const splitted = x.split('*')
      const [width, length] = [
        parseFloat(replaceCommaWithDot(splitted[0])),
        parseFloat(replaceCommaWithDot(splitted[1]))
      ]
      widthArray.push(width)
      lengthArray.push(length)
    })

    return {
      minWidth: Math.min(...widthArray),
      maxWidth: Math.max(...widthArray),
      minLength: Math.min(...lengthArray),
      maxLength: Math.max(...lengthArray),
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