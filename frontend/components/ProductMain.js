import PropTypes from 'prop-types'
import Image from 'next/image'

import { useState, useEffect } from 'react'
import useCart from '../lib/hooks/useCart'
import { convertPrice, convertSize } from '../lib/utils/converters'
import HearthRegular from './icons/HearthRegular'


export default function ProductMain({
  product,
  variations,
  option,
  onOptionChange,
}) {
  const { name, slug } = product
  let { image } = product

  const {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
  } = useCart()
  const [isInCart, setIsInCart] = useState(() => checkIsInCart())

  function checkIsInCart() {
    const product = cart.find(x => x.product.id === option.id)
    if (product) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (checkIsInCart()) {
      setIsInCart(true)
    } else {
      setIsInCart(false)
    }
  }, [cart])

  // if (image !== undefined && image.startsWith('http')) {
  image = `/media/product-images/${name.replace(' ', '_')}.jpg`
  // }

  return (
    <>
      <div className="product-main-images">
        <Image
          src={image}
          alt={slug}
          height={500}
          width={500}
        />
      </div>

      <div className="product-main-props">
        <h2>{name}</h2>
        <div className="product-main-size">
          <h5>Выбрать размер:</h5>
          <select
            name="select"
            value={option.id}
            onChange={onOptionChange}
          >
            {variations.map(variation => (
              <option key={variation.id} value={variation.id}>
                {convertSize(variation.size)}
              </option>
            ))}
          </select>
        </div>
        <h3>{convertPrice(option.price)} ₽</h3>
        <div className="product-main-buttons">
          <button
            className="product-buy"
            onClick={() => handleAddToCart({
              name, slug, id: option.id, size: option.size, price: option.price
            })}
          >
            В корзину
          </button>
          {isInCart && (<button
            className="product-buy"
            onClick={() => handleRemoveFromCart({ id: option.id })}
          >
            Убрать из корзины
          </button>)}
          <button className="product-favorite">
            <HearthRegular height={15} width={15} color={"white"} />
          </button>
        </div>
      </div>
    </>
  )
}

ProductMain.propTypes = {
  product: PropTypes.object,
  variations: PropTypes.array,
  option: PropTypes.object,
  onOptionChange: PropTypes.func,
}