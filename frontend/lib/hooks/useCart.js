import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  addToCartAsync,
  removeSingleFromCartAsync,
  removeFromCartAsync,
  addToCartSync,
  removeSingleFromCartSync,
  removeFromCartSync,
  syncCart,
  selectCart,
} from '../slices/cartSlice'
import { selectUser } from '../slices/authSlice'
import {
  // getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from '../utils/localStorageUtils'

export default function useCart() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectUser)
  const { userCart } = useSelector(selectCart)

  const userIsDefined = useMemo(
    () => (user !== undefined && user !== null),
    [user]
  )

  // const getCartFromLocalStorage = () => {
  //   return getFromLocalStorage('userCart', [])
  // }

  const removeCartFromLocalStorage = () => {
    removeFromLocalStorage('userCart')
  }

  const saveCartToLocalStorage = () => {
    saveToLocalStorage('userCart', userCart)
  }

  const handleCartAction = (asyncFunc, syncFunc, args) => {
    const { id, name, slug, size, price } = args
    if (userIsDefined) {
      dispatch(asyncFunc({ id }))
    } else {
      dispatch(syncFunc({ id, size, price, product: { name, slug } }))
    }
  }

  const handleAddToCart = useCallback((args) => handleCartAction(
    addToCartAsync,
    addToCartSync,
    args,
  ), [])

  const handleRemoveSingleFromCart = useCallback((args) => handleCartAction(
    removeSingleFromCartAsync,
    removeSingleFromCartSync,
    args,
  ), [])

  const handleRemoveFromCart = useCallback((args) => handleCartAction(
    removeFromCartAsync,
    removeFromCartSync,
    args,
  ), [])

  const updateCart = useCallback(() => {
    dispatch(syncCart())
  }, [])

  return {
    cart: userCart,
    handleAddToCart,
    handleRemoveSingleFromCart,
    handleRemoveFromCart,
    updateCart,
    saveCartToLocalStorage,
    removeCartFromLocalStorage,
  }
}