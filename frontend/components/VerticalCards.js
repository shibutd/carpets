import React, { useState, useEffect, useRef, Children } from 'react'
import PropTypes from 'prop-types'

import useFavorites from '../lib/hooks/useFavorites'
import useCart from '../lib/hooks/useCart'

export default function VerticalCards({ title, children, ...props }) {
  const [moveCounter, setMoveCounter] = useState(0)
  const [cardsLength, setCardsLength] = useState(3)
  const cardsRef = useRef(null)
  const [childrenCount, setChildrenCount] = useState(Children.count(children))

  const { addToFavorites } = useFavorites()
  const { handleAddToCart } = useCart()

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

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && typeof child.type === 'function') {
      return React.cloneElement(child, {
        addToFavorites,
        handleAddToCart,
        ...props
      })
    }
    return child
  })

  return (
    <section className="vertical">
      <h4 className="vertical-title">{title}</h4>
      <div ref={cardsRef} className="vertical-wrapper">
        <div className="vertical-cards">
          {childrenWithProps}
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
    </section>
  )
}

VerticalCards.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}