import { useRef, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import BubblyButton from './BubblyButton'
import HearthRegular from './icons/HearthRegular'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import { convertPrice } from '../lib/utils/converters'


 function VerticalVariationCard(props) {
  const { id, title, slug, size, price, images, ...rest } = props
  const { user, addToFavorites, handleAddToCart } = rest
  const cardRef = useRef(null)
  const timerRef = useRef(null)

  const mainImage = images.length > 0 ? images[0].image : null
  const imageName = title.replace(/ /g, '_').replace(/\"/g, '')

  const imageSrc = mainImage
    ? `/media/product-images/${imageName}.jpg`
    : `/media/product-images/No_Image.jpg`

  const handleClickFavorite = () => {
    const favoriteIcon = cardRef.current.querySelector('.vertical-cart-icon')

    if (!user) {
      favoriteIcon.value = "Войдите в аккаунт"
      setTimeout(() => {
        favoriteIcon.value = "Добавить в избранное"
      }, 2000)
      return
    }

    favoriteIcon.classList.add('vertical-cart-icon-pushed')
    favoriteIcon.value = "Добавлено!"

    setTimeout(() => {
      favoriteIcon.classList.remove('vertical-cart-icon-pushed')
      favoriteIcon.value = "Добавить в избранное"
    }, 2000)

    addToFavorites(id)
  }

  const handleClickAddToCart = () => {
    clearTimeout(timerRef.current)
    handleAddToCart({ name, slug, id, size, price })

    const addToCartIcon = cardRef.current.querySelector(
      '.vertical-cart-button'
    )

    addToCartIcon.classList.add('vertical-cart-button-pushed')
    // addToCartIcon.classList.add('tooltip')

    timerRef.current = setTimeout(() => {
      addToCartIcon.classList.remove('vertical-cart-button-pushed')
      // addToCartIcon.classList.remove('tooltip')
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
          <Link href={`/products/${slug}`}><a>{title}</a></Link>
        </div>
        <div className="vertical-card-cost">
          {`${convertPrice(price)} ₽`}
        </div>
      </div>
      <div className="vertical-card-right">
        {/*<BubblyButton
          className="vertical-cart-icon tooltip"
          value="Добавить в избранное"
          onClick={handleClickFavorite}
        >
          <HearthRegular height={20} width={20} />
        </BubblyButton>*/}

        <button
          className="vertical-cart-icon tooltip"
          value="Добавить в избранное"
          onClick={handleClickFavorite}
        >
          <HearthRegular height={20} width={20} />
        </button>
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
  title: PropTypes.string,
  slug: PropTypes.string,
  size: PropTypes.string,
  price: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
}

export default memo(VerticalVariationCard)