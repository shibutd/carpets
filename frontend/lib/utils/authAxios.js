import axios from 'axios'

import { refresh, logout } from '../slices/authSlice'
import { decodeJWT } from '../utils/decode-jwt'
import { getFromLocalStorage } from '../utils/localStorageUtils'


export async function authAxios(dispatch, state) {
  const instance = axios.create()

  instance.interceptors.request.use(async (config) => {
    let { token } = state

    if (!token) {
      const { access: token } = getFromLocalStorage('userInfo', {})
      if (!token) return config
    }
    const accessTokenDecoded = decodeJWT(token)

    const expireTime = accessTokenDecoded.exp * 1000
    const currentTime = new Date().getTime()

    if (expireTime + 5000 < currentTime) {
      const { refresh: refreshToken } = getFromLocalStorage('userInfo', {})
      try {
        const response = await dispatch(refresh(refreshToken))
        token = response.payload.accessToken
      } catch (error) {
        await dispatch(logout())
        return config
      }
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
  })

  return instance
}