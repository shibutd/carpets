import { useState, useEffect } from 'react'

import CartItem from './CartItem'
import CartSidebar from './CartSidebar'

export default function Cart({ items }) {
  const [itemsState, setItemsState] = useState(items || [])

  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const changeItemQuantity = (id, n) => {
    const itemsCopy = [...itemsState]

    const foundIndex = itemsCopy.findIndex(item => item.id === id)
    const item = itemsCopy[foundIndex]

    const resultQuantity = item.quantity + n

    if (resultQuantity > 0 && resultQuantity <= 99) {
      item.quantity += n
      itemsCopy[foundIndex] = item
      setItemsState([...itemsCopy])
    }
  }

  const removeFromCart = (id) => {
    const filteredItems = itemsState.filter(item => item.id !== id)
    setItemsState([...filteredItems])
  }

  useEffect(() => {
    let newQuantity = 0
    let newPrice = 0

    itemsState.forEach(item => {
      newQuantity += item.quantity
      newPrice += item.quantity * item.price
    })

    setTotalQuantity(newQuantity)
    setTotalPrice(newPrice)
  }, [itemsState])

  return (
    <div className="cart-wrapper">
      <div className="cart-products">
        {(itemsState.length === 0)
          ? (<h5 id="empty-cart">В корзине нет товаров</h5>)
          : (itemsState.map(item => (
            <CartItem
              key={item.id}
              item={item}
              changeItemQuantity={changeItemQuantity}
              removeFromCart={removeFromCart}
            />
          )))
        }
      </div>
      <div className="cart-props">
        <CartSidebar
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  )
}