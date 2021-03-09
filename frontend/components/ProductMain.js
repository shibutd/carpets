import { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Tippy from '@tippyjs/react'

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
  const [option, setOption] = useState(() =>
    variations.length > index ? variations[index] : {})
  const [isInCart, setIsInCart] = useState(false)
  const [tipContent, setTipContent] = useState("Добавить в избранное")
  const { addToFavorites } = useFavorites()
  const {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
  } = useCart()

  const checkIsInCart = () =>
    cart.find(x => x.variation.id === option.id) !== undefined

  const handleClickFavorite = () => {
    if (!user) {
      setTipContent("Войдите в аккаунт")
      setTimeout(() => {
        setTipContent("Добавить в избранное")
      }, 2000)
      return
    }

    addToFavorites(option.id)

    setTipContent("Добавлено!")
    setTimeout(() => {
      setTipContent("Добавить в избранное")
    }, 2000)
  }

  useEffect(() => {
    setOption(variations[index])
  }, [index])

  useEffect(() => {
    setIsInCart(checkIsInCart())
  }, [cart, option])

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
          <Tippy
            theme='blue'
            interactive={true}
            delay={[100, null]}
            content={tipContent}
          >
            <button
              className="product-favorite"
              onClick={handleClickFavorite}
            >
              <HearthRegular height={17} width={17} color={"white"} />
            </button>
          </Tippy>
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