import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  login,
  registerUser,
  refresh,
  logout,
  selectUser
} from '../slices/authSlice'
import useCart from './useCart'

export default function useAuth() {
  const dispatch = useDispatch()
  const { user, loadingStatus, error } = useSelector(selectUser)
  const {
    updateCart,
    saveCartToLocalStorage,
    removeCartFromLocalStorage,
  } = useCart()

  const userIsDefined = useMemo(
    () => (user !== undefined && user !== null),
    [user]
  )

  const syncCartOnAuth = () => {
    updateCart()
    removeCartFromLocalStorage()
  }

  const tryToRegisterUser = useCallback((data) => {
    dispatch(registerUser(data))
      .then(() => syncCartOnAuth())
  }, [])

  const tryToLoginUser = useCallback((data) => {
    dispatch(login(data))
      .then(() => syncCartOnAuth())
  }, [])

  const logoutUser = useCallback(async () => {
    saveCartToLocalStorage()
    dispatch(logout())
  }, [])

  const setNotAuthenticated = () => {
    dispatch(logout())
    updateCart()
  }

  const tryToRefreshToken = async (refreshToken) => {
    try {
      await dispatch(refresh(refreshToken))
      updateCart()
    } catch (error) {
      setNotAuthenticated()
    }
  }

  const initUser = (userInfoFromLS) => {
    if (userInfoFromLS && !userIsDefined) {
      const refreshToken = userInfoFromLS.refresh || ''
      tryToRefreshToken(refreshToken)
    } else {
      (loadingStatus === 'loaded') ? null : setNotAuthenticated()
    }
  }

  const getUserInfoFromLocalStorage = () => {
    let userInfo
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo'))
    } catch (error) {
      localStorage.removeItem('userInfo')
    }
    return userInfo
  }

  useEffect(() => {
    const userInfo = getUserInfoFromLocalStorage()
    initUser(userInfo)
  }, [])

  return {
    user,
    loaded: (loadingStatus === 'loaded'),
    error,
    tryToRegisterUser,
    tryToLoginUser,
    logoutUser,
  }
}