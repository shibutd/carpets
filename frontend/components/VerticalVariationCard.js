import { useState, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import Tippy from '@tippyjs/react'

import BubblyButton from './BubblyButton'
import HearthRegular from './icons/HearthRegular'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import { convertPrice, convertSize } from '../lib/utils/converters'


 function VerticalVariationCard(props) {
  const { id, name, slug, size, price, images, ...rest } = props
  const { user, addToFavorites, handleAddToCart } = rest
  const [tipContent, setTipContent] = useState("Добавить в избранное")
  const cardRef = useRef(null)
  const timerRef = useRef(null)

  const mainImage = images.length > 0 ? images[0].image : null
  const imageName = name.replace(/ /g, '_').replace(/\"/g, '')

  const imageSrc = mainImage
    ? `/media/product-images/${imageName}.jpg`
    : `/media/product-images/No_Image.jpg`

  const handleClickFavorite = () => {
    const favoriteIcon = cardRef.current.querySelector('.vertical-cart-icon')

    if (!user) {
      setTipContent("Войдите в аккаунт")
      setTimeout(() => {
        setTipContent("Добавить в избранное")
      }, 2000)
      return
    }

    addToFavorites(id)

    favoriteIcon.classList.add('vertical-cart-icon-pushed')
    setTipContent("Добавлено!")

    setTimeout(() => {
      favoriteIcon.classList.remove('vertical-cart-icon-pushed')
      setTipContent("Добавить в избранное")
    }, 2000)
  }

  const handleClickAddToCart = () => {
    clearTimeout(timerRef.current)
    handleAddToCart({ id, name, slug, size, price })

    const addToCartIcon = cardRef.current.querySelector(
      '.vertical-cart-button'
    )
    addToCartIcon.classList.add('vertical-cart-button-pushed')

    timerRef.current = setTimeout(() => {
      addToCartIcon.classList.remove('vertical-cart-button-pushed')
    }, 2000)

  }

  return (
    <div
      ref={cardRef}
      className="vertical-card"
    >
      <div className="vertical-card-left">
        <div className="vertical-card-image">
          <Link href={`/products/${slug}`}>
            <a>
              <Image
                src={imageSrc}
                alt={slug}
                height={150}
                width={150}
                loading="eager"
              />
            </a>
          </Link>
        </div>
        <div className="vertical-card-title">
          <Link href={`/products/${slug}`}><a>{name}</a></Link>
        </div>
        <div className="vertical-card-size">
          {convertSize(size)}
        </div>
        <div className="vertical-card-cost">
          {`${convertPrice(price)} ₽`}
        </div>
      </div>
      <div className="vertical-card-right">
        <Tippy
          theme='blue'
          offset={[0,-5]}
          delay={[100, null]}
          content={tipContent}
          hideOnClick={false}
        >
          <button
            className="vertical-cart-icon"
            onClick={handleClickFavorite}
          >
            <HearthRegular height={20} width={20} />
          </button>
        </Tippy>
        <BubblyButton
          className="vertical-cart-button"
          onClick={handleClickAddToCart}
        >
          <ShoppingCartSolid height={20} width={20} />
        </BubblyButton>
      </div>
    </div>
  )
}

VerticalVariationCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  slug: PropTypes.string,
  size: PropTypes.string,
  price: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object),
}

export default memo(VerticalVariationCard)