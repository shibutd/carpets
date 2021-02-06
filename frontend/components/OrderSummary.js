import { useEffect } from 'react'
// import { useQuery } from 'react-query'

import useCart from '../lib/hooks/useCart'

export default function OrderSummary() {
  const { cart, updateCart } = useCart()

  // const {
  //   isLoading,
  //   isError,
  //   data,
  // } = useQuery('orderlines', () => fetchOrderlines())

  // useEffect(() => {
  //   updateCart()
  // }, [])

  return (
    <div className="checkout-ordersummary">
      <p>Внимательно проверьте заказ:</p>
      <table className="checkout-ordersummary-table">
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
              <td>{item.variation.price} ₽</td>
              <td width="20%">{item.quantity}</td>
              <td>{item.variation.price * item.quantity} ₽</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4">Общая сумма:</td>
            <td>
              {cart.reduce((sum, item) => {
                return sum + item.variation.price * item.quantity
              }, 0)} ₽
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}