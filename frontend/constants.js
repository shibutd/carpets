const targetUrl = 'http://127.0.0.1:8000'

// Authentication urls

const authenticationUrl = `${targetUrl}/auth/users`

export const userCreateUrl = `${authenticationUrl}/create/`

export const tokenObtainUrl = `${authenticationUrl}/token_obtain_pair/`

export const tokenRefreshUrl = `${authenticationUrl}/token_refresh/`

// Interaction with store

export const storeUrl = `${targetUrl}/store`

// Products urls

export const productUrl = `${storeUrl}/products`

// Interaction with cart

export const addToCartUrl = (productSlug) => {
  return `${productUrl}/${productSlug}/add-to-cart/`
}

export const removeFromCartSingleUrl = (productSlug) => {
  return `${productUrl}/${productSlug}/remove-single-from-cart/`
}

export const removeFromCartUrl = (productSlug) => {
  return `${productUrl}/${productSlug}/remove-from-cart/`
}

// Categories url

export const categoryUrl = `${storeUrl}/categories/`