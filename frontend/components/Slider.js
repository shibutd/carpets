import React, { useState, useEffect, useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'

export function useSlide({ minValue, maxValue, ...config }) {
  const { min, max } = config
  const [sliderMinVal, setSliderMinVal] = useState(minValue || min)
  const [sliderMaxVal, setSliderMaxVal] = useState(maxValue || max)
  const [configuration, setConfiguration] = useState(config)

  const onChange = useCallback((minVal, maxVal) => {
    setSliderMinVal(minVal)
    setSliderMaxVal(maxVal)
  }, [])

  useEffect(() => {
    setConfiguration({
      ...config,
      onChange,
      minValue: sliderMinVal,
      maxValue: sliderMaxVal,
    })
  }, [sliderMinVal, sliderMaxVal])

  return [sliderMinVal, sliderMaxVal, configuration]
}

function Slider({
  classes,
  label,
  onChange,
  minValue,
  maxValue,
  ...sliderProps
}) {
  const [sliderMinVal, setSliderMinVal] = useState(minValue)
  const [sliderMaxVal, setSliderMaxVal] = useState(maxValue)
  const [mouseState, setMouseState] = useState(null)
  const sliderRef = useRef(null)
  const { max, min } = sliderProps
  let range, thumbMin, thumbMax

  const changeMinCallback = (e) => {
    const val = parseFloat(e.target.value)
    if (val < maxValue) {
      setSliderMinVal(val)
      changeMinPercentage(val)
    }
  }

  const changeMaxCallback = (e) => {
    const val = parseFloat(e.target.value)
    if (val > minValue) {
      setSliderMaxVal(val)
      changeMaxPercentage(val)
    }
  }

  const changeMinPercentage = (value) => {
    const percent = (value - min) / (max - min) * 100

    range = sliderRef.current.querySelector(".slider-input-range")
    thumbMin = sliderRef.current.querySelector(".thumb-left")

    thumbMin.style.left = `${percent}%`
    range.style.left = `${percent}%`
  }

  const changeMaxPercentage = (value) => {
    const percent = (max - value) / (max - min) * 100

    range = sliderRef.current.querySelector(".slider-input-range")
    thumbMax = sliderRef.current.querySelector(".thumb-right")

    thumbMax.style.right = `${percent}%`
    range.style.right = `${percent}%`
  }

  useEffect(() => {
    setSliderMinVal(minValue)
    changeMinPercentage(minValue)
    setSliderMaxVal(maxValue)
    changeMaxPercentage(maxValue)
  }, [minValue, maxValue])

  useEffect(() => {
    if (mouseState === 'up') {
      onChange(sliderMinVal, sliderMaxVal)
    }
  }, [mouseState])

  return (
    <div ref={sliderRef} className="slider">
      <div className="slider-text">
        <div className="slider-value">{sliderMinVal}</div>
        <div>&mdash;</div>
        <div className="slider-value">{sliderMaxVal}</div>
      </div>

      <input
        type="range"
        value={sliderMinVal ? sliderMinVal : min}
        {...sliderProps}
        className={`slider-min ${classes}`}
        id={`${label}-min`}
        onChange={changeMinCallback}
        onMouseDown={() => setMouseState('down')}
        onMouseUp={() => setMouseState('up')}
      />
      <input
        type="range"
        value={sliderMaxVal ? sliderMaxVal : max}
        {...sliderProps}
        className={`slider-max ${classes}`}
        id={`${label}-max`}
        onChange={changeMaxCallback}
        onMouseDown={() => setMouseState('down')}
        onMouseUp={() => setMouseState('up')}
      />

      <div className="slider-input">
        <div className="slider-input-track" />
        <div className="slider-input-range" />
        <div className="slider-input-thumb thumb-left" />
        <div className="slider-input-thumb thumb-right" />
      </div>

    </div>
  )
}

export default memo(Slider)

Slider.propTypes = {
  classes: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
}