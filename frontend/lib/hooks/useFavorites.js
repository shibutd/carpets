import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectUser } from '../slices/authSlice'
import { authAxios } from '../utils/authAxios'
import {
  favoritesUrl,
  addToFavoritesUrl,
  removeFromFavoritesUrl
} from '../../constants'


export default function useFavorites() {
  const dispatch = useDispatch()
  const authInfo = useSelector(selectUser)

  const makeRequestToUrl = async (url, method = 'get') => {
    try {
      const axios = await authAxios(dispatch, authInfo)
      const res = (method === 'get')
        ? await axios.get(url)
        : await axios.post(url)
      return res
    } catch (error) {
      return error.response
    }
  }

  const getFavorites = useCallback(async () => {
    return await makeRequestToUrl(favoritesUrl)
  }, [])

  const addToFavorites = useCallback(async (id) => {
    return await makeRequestToUrl(addToFavoritesUrl(id), 'post')
  }, [])

  const removeFromFavorites = useCallback(async (id) => {
    return await makeRequestToUrl(removeFromFavoritesUrl(id), 'post')
  }, [])

  return {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
  }
}