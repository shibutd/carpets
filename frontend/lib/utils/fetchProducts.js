import axios, { CancelToken } from 'axios';

import { clientProductUrl } from '../../constants'


export async function fetchProducts(slug, page, filterConditions) {
  const source = CancelToken.source()
  const url = `${clientProductUrl}?category=${slug}&page=${page}`

  const query = filterConditions.reduce((query, condition) => {
    const type = condition.type
    const name = condition.name.replace(/ /g, '+')
    return query.concat(`&${type}=${name}`)
  }, '')

  const promise = await axios.get(
    `${url}${query}`,
    { cancelToken: source.token }
  )

  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise.data
}