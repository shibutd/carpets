import { useRef, memo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import TrashSolid from './icons/TrashSolid'
import HearthSolid from './icons/HearthSolid'
import MinusSolid from './icons/MinusSolid'
import PlusSolid from './icons/PlusSolid'
import { convertPrice, convertSize } from '../lib/utils/converters'

function CartItem({
  user,
  item,
  addToCart,
  removeSingleFromCart,
  removeFromCart,
  addToFavories
}) {
  const itemRef = useRef(null)
  const { variation, quantity } = item

  let image = `/media/product-images/${name.replace(' ', '_')}.jpg`

  const getArgsFromVariation = (variation) => {
    const { id, product, price, size } = variation
    const { name, slug } = product
    return { id, name, slug, price, size }
  }

  const handleAddToFavorites = (id) => {
    if (!user) return

    addToFavories(id)

    const heartIcon = itemRef.current.querySelector('#hearth-solid')
    heartIcon.classList.add('hearth-beat')
    setTimeout(() => {
      heartIcon.classList.remove('hearth-beat')
    }, 2000);
  }

  return (
    <div ref={itemRef} className="cart-products-item">
      <div className="cart-products-item-img">
        <Image
          src={image}
          alt=""
          height={120}
          width={120}
        />
      </div>
      <div className="cart-products-item-name">
        <Link href={`/products/${variation.product.slug}`}>
          <a>
            {variation.product.name}
          </a>
        </Link>
        <p>Размер: {convertSize(variation.size)}</p>
      </div>

      <div className="cart-products-item-actions">
        <div className="cart-products-item-plusminus">
          <MinusSolid
            height={14}
            width={14}
            onClick={() =>
              removeSingleFromCart(getArgsFromVariation(variation)
            )}
          />
          <div className="cart-products-item-plusminus-val">
            {quantity}
          </div>
          <PlusSolid
            height={14}
            width={14}
            onClick={() => addToCart(getArgsFromVariation(variation))}
          />
        </div>
        <div className="cart-products-item-price">
          {`${convertPrice(variation.price * quantity)} ₽`}
        </div>
      </div>

      <div className="cart-products-item-icons">
        <HearthSolid
          id="hearth-solid"
          height={14}
          width={14}
          onClick={() => handleAddToFavorites(variation.id)}

        />
        <TrashSolid
          height={14}
          width={14}
          onClick={() => removeFromCart(variation)}
        />
      </div>
    </div>
  )
}

CartItem.propTypes = {
  user: PropTypes.string,
  item: PropTypes.object,
  addToCart: PropTypes.func,
  removeSingleFromCart: PropTypes.func,
  removeFromCart: PropTypes.func,
  addToFavories: PropTypes.func,
}

export default memo(CartItem)