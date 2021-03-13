import { CancelToken } from 'axios';
import store from '../../store'

import { userAddressUrl } from '../../constants'
import { authAxios } from './authAxios'

export async function fetchUserAddresses() {
  const source = CancelToken.source()
  const { dispatch, getState } = store

  const axios = await authAxios(dispatch, getState().auth)

  const promise = await axios.get(
    userAddressUrl,
    { cancelToken: source.token }
  )

  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }
  return promise.data
}