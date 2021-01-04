import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Carousel({ images }) {
  const [currentSlide, setCurrentSlide] = useState(1)
  let timer

  const plusSlides = (n) => {
    stopTimer()

    let index = currentSlide + n
    const length = images.length

    if (index < 1) {
      index = length
    } else if (index > length) {
      index = 1
    }

    setCurrentSlide(index)
  }

  function stopTimer() {
    if (timer) {
      clearTimeout(timer)
    }
  }

  useEffect(() => {
    timer = setTimeout(() => plusSlides(1), 5000);

    const slides = document.querySelectorAll(".slide")
    const dots = document.querySelectorAll('.dot')

    slides.forEach((slide) => {
      slide.style.display = "none"
    })
    slides[currentSlide - 1].style.display = "block"

    dots.forEach(dot => {
      dot.className = dot.className.replace(" active", "")
    })
    dots[currentSlide - 1].className += " active"

    return () => {
      stopTimer()
    }
  }, [currentSlide])

  return (
    <>
      <div className="slides">
        {images.map((image, i) => (
          <div className="slide fade">
            <Image
              key={image.id}
              src={`/images/${image.src}`}
              alt={`carousel-img${i + 1}`}
              layout="fill"
              objectFit="cover"
              loading="eager"
            />
          </div>
        ))}
      </div>
      <a className="carousel-prev" onClick={() => plusSlides(-1)}>&#10094;</a>
      <a className="carousel-next" onClick={() => plusSlides(1)}>&#10095;</a>

      <div className="dots">
        {images.map((image, i) => (
          <span
            key={image.id}
            className="dot"
            onClick={() => setCurrentSlide(i + 1)}
          />
        ))}
      </div>
    </>
  )
}