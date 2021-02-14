import { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import BubblyButton from './BubblyButton'
import HearthRegular from './icons/HearthRegular'
import useCart from '../lib/hooks/useCart'
import useFavorites from '../lib/hooks/useFavorites'
import { convertPrice, convertSize } from '../lib/utils/converters'


function ProductMain({
  name,
  slug,
  images,
  variations,
  index,
  onOptionChange,
}) {
  const [option, setOption] = useState(
    () => variations.length > index ? variations[index] : {}
  )
  const { addToFavorites } = useFavorites()
  const {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
  } = useCart()

  const checkIsInCart = () => {
    const product = cart.find(x => x.variation.id === option.id)
    if (product) {
      return true
    }
    return false
  }

  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    setOption(variations[index])
  }, [index])

  useEffect(() => {
    const productInCart = checkIsInCart()
    setIsInCart(productInCart)
  }, [cart])

  useEffect(() => {
    setIsInCart(checkIsInCart())
  }, [])

  // if (image !== undefined && image.startsWith('http')) {
  let image = `/media/product-images/${name.replace(/ /g, '_')}.jpg`
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
        <h3>{`${convertPrice(option.price)} ₽`}</h3>
        <div className="product-main-buttons">
          <BubblyButton
            label={"В корзину"}
            className="product-buy"
            onClick={() => handleAddToCart({
              id: option.id,
              size: option.size,
              price: option.price,
              name,
              slug,
            })}
          />
          {isInCart && (
            <button
              className="product-buy"
              onClick={() => handleRemoveFromCart({ id: option.id })}
            >
              Убрать
            </button>
          )}
          <button
            className="product-favorite tooltip"
            value="Добавить в избранное"
            onClick={() => addToFavorites(option.id)}
          >
            <HearthRegular height={17} width={17} color={"white"} />
          </button>
        </div>
      </div>
    </>
  )
}

ProductMain.propTypes = {
  name: PropTypes.string,
  slug: PropTypes.string,
  images: PropTypes.array,
  index: PropTypes.number,
  variations: PropTypes.array,
  onOptionChange: PropTypes.func,
}

export default memo(ProductMain)