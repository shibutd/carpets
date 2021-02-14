import { useRef } from 'react'
import PropTypes from 'prop-types'

export default function BubblyButton({
  children, label, className, onClick, ...rest
}) {
  const btnRef = useRef(null)
  const timerRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    clearTimeout(timerRef.current)

    const button = btnRef.current
    button.classList.add('animate')

    timerRef.current = setTimeout(() => {
      button.classList.remove('animate')
    }, 700)

    onClick()
  }

  return (
    <button
      ref={btnRef}
      className={`bubbly-button ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {label}
      {children}
    </button>
  )
}

BubblyButton.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
}