import PropTypes from 'prop-types'
import Link from 'next/link'

import { convertPrice } from '../lib/utils/converters'

export default function CartSidebar({ totalQuantity, totalPrice }) {
  const quantityToString = totalQuantity.toString()
  let goods = ''

  if (quantityToString === '1') {
    goods = 'товар'
  } else if (['2', '3', '4'].includes(quantityToString)) {
    goods = 'товара'
  } else {
    goods = 'товаров'
  }

  return (
    <>
      <h5>В корзине</h5>
      <p>{totalQuantity} {goods}</p>
      <h5>
        {convertPrice(totalPrice)} ₽
      </h5>

      <div className="cart-props-buttons">
        {totalQuantity > 0
          ? (<Link href="/checkout">
                <a>
                  <button>Перейти к оформлению</button>
                </a>
              </Link>
            )
          : (<div></div>)}
        <Link href="/">
          <a>
            <button className="gray-button">Вернуться к покупкам</button>
          </a>
        </Link>
      </div>
    </>
  )
}

CartSidebar.propTypes = {
  totalQuantity: PropTypes.number,
  totalPrice: PropTypes.number,
}