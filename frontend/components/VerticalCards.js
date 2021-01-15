import { useState, useEffect, useRef, Children } from 'react'
import PropTypes from 'prop-types'

export default function VerticalCards({ children }) {
  const [startIndex, setStartIndex] = useState(1)
  const [cardsLength, setCardsLength] = useState(3)
  const cardsRef = useRef(null)
  const [childrenCount, setChildrenCount] = useState(Children.count(children))

  function computeIndex(index) {
    if (index < 1) {
      index = 1
    } else if (index > (childrenCount - cardsLength + 1)) {
      index = childrenCount - cardsLength + 1
    }
    return index
  }

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

    switch (startIndex) {
      case 1:
        prevArrow.style.display = "none"
        break
      case (childrenCount - cardsLength + 1):
        nextArrow.style.display = "none"
        break
      default:
        prevArrow.style.display = ""
        nextArrow.style.display = ""
    }
  }

  function showContent(index) {
    const cards = Array.from(
      cardsRef.current.querySelectorAll(".vertical-card")
    )

    cards.map((card, i) => {
      if ((i < index - 1) || (i >= (index + cardsLength - 1))) {
        card.style.display = "none"
      } else {
        card.style.display = "flex"
      }
    })
  }

  const moveContent = (n) => {
    let index = computeIndex(startIndex + n)
    setStartIndex(index)
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
    const index = computeIndex(startIndex)
    setStartIndex(index)
  }, [cardsLength, childrenCount])

  useEffect(() => {
    showContent(startIndex)
    showArrows()
  }, [startIndex, cardsLength, childrenCount])

  return (
    <>
      <div ref={cardsRef} className="vertical-cards">
        {children}
        <a
          className="prev-vertical-card"
          onClick={() => moveContent(-1)}
        >
          &#10094;
        </a>
        <a
          className="next-vertical-card"
          onClick={() => moveContent(1)}
        >
          &#10095;
        </a>
      </div>
    </>
  )
}

VerticalCards.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
}