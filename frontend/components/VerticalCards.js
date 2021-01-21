import { useState, useEffect, useRef, Children } from 'react'
import PropTypes from 'prop-types'

export default function VerticalCards({ children }) {
  const [moveCounter, setMoveCounter] = useState(0)
  const [cardsLength, setCardsLength] = useState(3)
  const cardsRef = useRef(null)
  const [childrenCount, setChildrenCount] = useState(Children.count(children))

  function changeCardsLength() {
    if (document.documentElement.clientWidth <= 1280) {
      setCardsLength(3)
    } else {
      setCardsLength(4)
    }
  }

  function showArrows() {
    const prevArrow = cardsRef.current.querySelector(".prev-vertical-card")
    const nextArrow = cardsRef.current.querySelector(".next-vertical-card")

    switch (moveCounter) {
      case 0:
        prevArrow.style.display = "none"
        nextArrow.style.display = ""
        break
      case (childrenCount - cardsLength):
        prevArrow.style.display = ""
        nextArrow.style.display = "none"
        break
      default:
        prevArrow.style.display = ""
        nextArrow.style.display = ""
    }

    if (childrenCount === 0) {
        prevArrow.style.display = "none"
        nextArrow.style.display = "none"
    }
  }

  function updateCounter(value) {
    const newValue = moveCounter + value
    if (newValue >= 0 && newValue < (childrenCount - cardsLength + 1)) {
      setMoveCounter(newValue)
    }
  }

  function updateContent() {
    const cardsSlide = cardsRef.current.querySelector(".vertical-cards")
    const cards = Array.from(
      cardsRef.current.querySelectorAll(".vertical-card")
    )
    const size = cards.length > 0 ? cards[0].clientWidth : 0

    cardsSlide.style.transform = `translateX(-${size * moveCounter}px)`
  }

  useEffect(() => {
    window.addEventListener('resize', changeCardsLength)
    return () => {
      window.removeEventListener('resize', changeCardsLength)
    }
  }, [])

  useEffect(() => {
    setChildrenCount(Children.count(children))
  }, [children])

  useEffect(() => {
    updateContent()
    showArrows()
  }, [moveCounter, cardsLength, childrenCount])

  return (
    <div ref={cardsRef} className="vertical-wrapper">
      <div className="vertical-cards">
        {children}

      </div>
      <a
        className="prev-vertical-card"
        onClick={() => updateCounter(-1)}
      >
        &#10094;
      </a>
      <a
        className="next-vertical-card"
        onClick={() => updateCounter(1)}
      >
        &#10095;
      </a>
    </div>
  )
}

VerticalCards.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
}