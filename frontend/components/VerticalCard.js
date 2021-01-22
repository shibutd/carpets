import { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import HearthRegular from './icons/HearthRegular'
import ShoppingCartSolid from './icons/ShoppingCartSolid'
import useFavorites from '../lib/hooks/useFavorites'
import { convertPrice } from '../lib/utils/converters'


export default function VerticalCard(props) {
  const { title, slug, price, images, className } = props
  const cardRef = useRef(null)
  const { addToFavorites } = useFavorites()

  const mainImage = images.length > 0 ? images[0].image : null
  const imageName = title.replace(/ /g, '_').replace(/\"/g, '')

  const imageSrc = mainImage
    ? `/media/product-images/${imageName}.jpg`
    : `/media/product-images/No_Image.jpg`

  const handleClickFavorite = useCallback(() => {
    const favoriteIcon = cardRef.current.querySelector('.vertical-cart-icon')
    favoriteIcon.classList.add('vertical-cart-icon-pushed')
    favoriteIcon.classList.remove('tooltip')
    setTimeout(() => {
      favoriteIcon.classList.remove('vertical-cart-icon-pushed')
      favoriteIcon.classList.add('tooltip')
    }, 2000)
    // addToFavorites(slug)
  }, [])

  return (
    <div
      ref={cardRef}
      className={className ? `${className}` : "vertical-card"}
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
          {`от ${convertPrice(price)} ₽`}
        </div>
      </div>
      <div className="vertical-card-right">
        <button
          className="vertical-cart-icon tooltip"
          value="Добавить в избранное"
          onClick={handleClickFavorite}
        >
          <HearthRegular height={20} width={20} />
        </button>
        <button
          className="vertical-cart-button"
        >
          <Link href={`/products/${slug}`}>
            <a>
              <ShoppingCartSolid height={20} width={20} />
            </a>
          </Link>
        </button>
      </div>
    </div>
  )
}

VerticalCard.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  price: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
}