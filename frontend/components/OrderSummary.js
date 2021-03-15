import PropTypes from 'prop-types'

import { convertPrice } from '../lib/utils/converters'

export default function OrderSummary({ cart, changeTab }) {
  const total = cart.reduce((sum, item) => {
    return sum + item.variation.price * item.quantity
  }, 0)

  return (
    <div className="checkout-ordersummary">
      <p>Внимательно проверьте заказ:</p>
      <table className="table table--checkout">
        <thead>
          <tr>
            <td>№</td>
            <td>Наименование</td>
            <td>Цена</td>
            <td>Количество</td>
            <td>Сумма</td>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={item.variation.id}>
              <td>{idx + 1}.</td>
              <td>{item.variation.product.name}</td>
              <td>{`${convertPrice(item.variation.price)} ₽`}</td>
              <td width="20%">{item.quantity}</td>
              <td>{`${convertPrice(item.variation.price * item.quantity)} ₽`}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Общая сумма:</td>
            <td>
              {`${convertPrice(total)} ₽`}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="checkout-buttons">
        <button
          id="forwardbutton"
          onClick={() => changeTab(1)}
        >
          Далее &#10095;
        </button>
      </div>
    </div>
  )
}

OrderSummary.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.object),
  changeTab: PropTypes.func
}