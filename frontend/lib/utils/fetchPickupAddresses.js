import axios, { CancelToken } from 'axios';

import { pickupAddressUrl } from '../../constants'


export async function fetchPickupAddresses() {
  const source = CancelToken.source()

  const promise = await axios.get(
    pickupAddressUrl,
    { cancelToken: source.token }
  )

  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }
  return promise.data
}