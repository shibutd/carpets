import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

export function useSlide({ value, ...config}) {
  const [sliderVal, setSliderVal] = useState(value)
  const [configuration, setConfiguration] = useState(config)

  const onChange = useCallback((val) => {
    setSliderVal(val)
  }, [])

  useEffect(() => {
    setConfiguration({
      ...config,
      onChange,
      value: sliderVal
    })
  }, [sliderVal])

  return [sliderVal, configuration]
}

function Slider({ classes, label, onChange, value, ...sliderProps }) {
  const [sliderVal, setSliderVal] = useState(value)
  const [mouseState, setMouseState] = useState(null)

  useEffect(() => {
    setSliderVal(value)
  }, [value])

  const changeCallback = e => {
    setSliderVal(e.target.value)
  }

  useEffect(() => {
    if (mouseState === 'up') {
      onChange(sliderVal)
    }
  }, [mouseState])

  return (
    <div className="slider">
      <div className="slider-text">
        <div>от</div><div className="slider-value">{sliderVal}</div><div>метров</div>
      </div>
      <input
        type="range"
        value={sliderVal ? sliderVal : 0}
        {...sliderProps}
        className={`slider ${classes}`}
        id={label}
        onChange={changeCallback}
        onMouseDown={() => setMouseState('down')}
        onMouseUp={() => setMouseState('up')}
      />
    </div>
  )
}

export default React.memo(Slider)

Slider.propTypes = {
  classes: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}