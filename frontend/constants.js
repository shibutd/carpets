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

// Specific tag urls

export const hitsUrl = `${productUrl}/?tag=khity` // Hits

export const noveltiesUrl = `${productUrl}/?tag=novinki` // Novelties

// Categories url

export const categoryUrl = `${storeUrl}/categories`

// Products variations url

export const productVariationUrl = `${storeUrl}/product-variations`

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

// Orderlines url

export const orderLineUrl = `${storeUrl}/orderlines`
