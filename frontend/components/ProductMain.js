import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import { addToCart, selectCart } from '../lib/slices/cartSlice'
// import useAuth from '../lib/hooks/useAuth'
import useCart from '../lib/hooks/useCart'

export default function ProductMain({ product }) {
  const isInCart = true
  const {
    cart,
    handleAddToCart,
    handleRemoveSingleFromCart,
    handleRemoveFromCart,
    updateCartOnLogin,
  } = useCart()
  // const dispatch = useDispatch()
  // const { userCart } = useSelector(selectCart)
  // const user = useAuth()[0]
  const { name, size, price, slug } = product
  let { image } = product

  let priceToString = price.toString().split('.')[0]
  priceToString = (priceToString.length > 3)
    ? (priceToString.slice(0, -3).concat(' ', priceToString.slice(-3)))
    : priceToString

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
          <select name="select" defaultValue="67x105">
            <option value="67x105">67 x 105 см</option>
            <option value="67x210">67 x 210 см</option>
            <option value="95x140">95 x 140 см</option>
          </select>
        </div>
        <h3>{priceToString} ₽</h3>
        <div className="product-main-buttons">
          <button
            className="product-buy"
            onClick={() => handleAddToCart(product)}
          >
            В корзину
          </button>
          {isInCart && (<button
            className="product-buy"
            onClick={() => handleRemoveFromCart(product)}
          >
            Убрать из корзины
          </button>)}
          <button className="product-favorite">
            <Image
              src="/icons/heart-regular.svg"
              alt="heart"
              height={15}
              width={15}
            />
          </button>
          <button className="product-compare">
            <Image
              src="/icons/chart-bar-regular.svg"
              alt="chart"
              height={15}
              width={15}
            />
          </button>
        </div>
      </div>
    </>
  )
}

ProductMain.propTypes = {
  product: PropTypes.object
}