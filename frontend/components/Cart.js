import { useState, useEffect } from 'react'

import CartItem from './CartItem'
import CartSidebar from './CartSidebar'
import useCart from '../lib/hooks/useCart'
import useFavorites from '../lib/hooks/useFavorites'


export default function Cart() {
  const {
    cart,
    handleAddToCart,
    handleRemoveSingleFromCart,
    handleRemoveFromCart
  } = useCart()
  const { addToFavorites: handleAddToFavorites } = useFavorites()
  const { user } = useCart()

  const [totalQuantity, setTotalQuantity] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    let newQuantity = 0
    let newPrice = 0

    cart.forEach(item => {
      newQuantity += item.quantity
      newPrice += item.quantity * item.variation.price
    })

    setTotalQuantity(newQuantity)
    setTotalPrice(newPrice)
  }, [cart])

  return (
    <div className="cart-wrapper">
      <div className="cart-products">
        {(cart.length === 0)
          ? (<h5 id="empty-cart">В корзине нет товаров</h5>)
          : (cart.map(item => (
            <CartItem
              key={item.variation.id}
              user={user}
              item={item}
              addToCart={handleAddToCart}
              removeSingleFromCart={handleRemoveSingleFromCart}
              removeFromCart={handleRemoveFromCart}
              addToFavories={handleAddToFavorites}
            />
        )))}
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