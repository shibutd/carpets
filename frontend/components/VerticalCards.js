import { useState, useEffect, useRef, Children } from 'react'

export default function VerticalCards({ children }) {
  const [startIndex, setStartIndex] = useState(1)
  const [cardsLength, setCardsLength] = useState(() => {
    return (document.documentElement.clientWidth <= 1280) ? 3 : 4
  })
  const cardsRef = useRef(null)
  const childrenCount = Children.count(children)

  const moveContent = (n) => {
    let index = startIndex + n
    setStartIndex(index)
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

    if (startIndex === 1) {
      prevArrow.style.display = "none"
    } else if (startIndex === (childrenCount - cardsLength + 1)) {
      nextArrow.style.display = "none"
    } else {
      prevArrow.style.display = ""
      nextArrow.style.display = ""
    }
  }

  useEffect(() => {
    window.addEventListener('resize', changeCardsLength)
    return () => {
      window.removeEventListener('resize', changeCardsLength)
    }
  }, [])

  useEffect(() => {
    const cards = Array.from(cardsRef.current.querySelectorAll(".vertical-card"))

    let index = startIndex

    if (index < 1) {
      index = 1
    } else if (index > (childrenCount - cardsLength + 1)) {
      index = childrenCount - cardsLength + 1
    }

    setStartIndex(index)

    cards.map((card, i) => {
      if ((i < index - 1) || (i >= (index + cardsLength - 1))) {
        card.style.display = "none"
      } else {
        card.style.display = "flex"
      }
    })

    showArrows()
  }, [startIndex, cardsLength])

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