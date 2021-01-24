const targetUrl = 'http://127.0.0.1:8000'

// Authentication urls

const authenticationUrl = `${targetUrl}/auth/users`

export const userCreateUrl = `${authenticationUrl}/`

export const tokenObtainUrl = `${authenticationUrl}/token_obtain_pair/`

export const tokenRefreshUrl = `${authenticationUrl}/token_refresh/`


// Interaction with store

export const storeUrl = `${targetUrl}/store`

// Products urls

export const productUrl = `${storeUrl}/products`

// Categories url

export const categoryUrl = `${storeUrl}/categories`

// Promotions url

export const promotionUrl = `${storeUrl}/promotions`

// Products variations url

export const productVariationUrl = `${storeUrl}/product-variations`

// Specific tag urls

export const hitsUrl = `${productVariationUrl}/?tag=khity` // Hits

export const noveltiesUrl = `${productVariationUrl}/?tag=novinki` // Novelties


// Interaction with cart

export const addToCartUrl = (variationId) => {
  return `${productVariationUrl}/${variationId}/add_to_cart/`
}

export const removeFromCartSingleUrl = (variationId) => {
  return `${productVariationUrl}/${variationId}/remove_single_from_cart/`
}

export const removeFromCartUrl = (variationId) => {
  return `${productVariationUrl}/${variationId}/remove_from_cart/`
}

// Interaction with favorites

export const favoritesUrl = `${productVariationUrl}/favorites/`

export const addToFavoritesUrl = (variationId) => {
  return `${productVariationUrl}/${variationId}/add_to_favorites/`
}

export const removeFromFavoritesUrl = (variationId) => {
  return `${productVariationUrl}/${variationId}/remove_from_favorites/`
}

// Orderlines url

export const orderLineUrl = `${storeUrl}/orderlines`
