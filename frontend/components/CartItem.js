import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import { convertPrice, convertSize } from '../lib/utils/converters'

export default function CartItem({
  item,
  addToCart,
  removeSingleFromCart,
  removeFromCart
}) {
  const { product, quantity } = item
  let totalItemPrice = product.price * quantity

  let image = `/media/product-images/${name.replace(' ', '_')}.jpg`

  return (
    <div className="cart-products-item">
      <div className="cart-products-item-img">
        <Image
          src={image}
          alt=""
          height={120}
          width={120}
        />
      </div>
      <div className="cart-products-item-name">
        <Link href={`/products/${product.slug}`}>
          <a>
            {product.name}
          </a>
        </Link>
        <p>Размер: {convertSize(product.size)}</p>
      </div>
      <div className="cart-products-item-plusminus">
        <Image
          src="/icons/minus-solid.svg"
          alt="minus"
          layout="fixed"
          height={14}
          width={14}
          onClick={() => removeSingleFromCart(product)}
        />
        <div className="cart-products-item-plusminus-val">
          {quantity}
        </div>
        <Image
          src="/icons/plus-solid.svg"
          alt="plus"
          layout="fixed"
          height={14}
          width={14}
          onClick={() => addToCart(product)}
        />
      </div>
      <div className="cart-products-item-price">
        {`${convertPrice(totalItemPrice)} ₽`}
      </div>
      <div className="cart-products-item-likedelete">
        <Image
          src="/icons/heart-regular.svg"
          alt=""
          height={14}
          width={14}
        />
        <Image
          src="/icons/trash-solid.svg"
          alt=""
          height={14}
          width={14}
          onClick={() => removeFromCart({ id: product.id })}
        />
      </div>
    </div>
  )
}

CartItem.propTypes = {
  item: PropTypes.object,
  addToCart: PropTypes.func,
  removeSingleFromCart: PropTypes.func,
  removeFromCart: PropTypes.func,
}