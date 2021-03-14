const nodeUrl = process.env.NODE_BASE_URL

const clientUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL

// Authentication urls

const authenticationUrl = `${clientUrl}/auth/`

// User url

const userUrl = `${authenticationUrl}users/`

export const userCreateUrl = `${userUrl}`

export const tokenObtainUrl = `${userUrl}token_obtain_pair/`

export const tokenRefreshUrl = `${userUrl}token_refresh/`

// User Addresses url

export const userAddressUrl = `${authenticationUrl}user-addresses/`


// Interaction with store
export const nodeStoreUrl = `${nodeUrl}/store/`

export const clientStoreUrl = `${clientUrl}/store/`

// Products urls
export const nodeProductUrl = `${nodeStoreUrl}products/`

export const clientProductUrl = `${clientStoreUrl}products/`

// Categories url
export const nodeCategoryUrl = `${nodeStoreUrl}categories/`

export const clientCategoryUrl = `${clientStoreUrl}categories/`

// Promotions url
export const promotionUrl = `${clientStoreUrl}promotions/`

// Products variations url
export const productVariationUrl = `${clientStoreUrl}product-variations/`

// Specific tag urls

export const hitsUrl = `${productVariationUrl}?tag=khity` // Hits

export const noveltiesUrl = `${productVariationUrl}?tag=novinki` // Novelties


// Interaction with cart

export const addToCartUrl = (variationId) => {
  return `${productVariationUrl}${variationId}/add_to_cart/`
}

export const removeFromCartSingleUrl = (variationId) => {
  return `${productVariationUrl}${variationId}/remove_single_from_cart/`
}

export const removeFromCartUrl = (variationId) => {
  return `${productVariationUrl}${variationId}/remove_from_cart/`
}

// Interaction with favorites

export const favoritesUrl = `${productVariationUrl}favorites/`

export const addToFavoritesUrl = (variationId) => {
  return `${productVariationUrl}${variationId}/add_to_favorites/`
}

export const removeFromFavoritesUrl = (variationId) => {
  return `${productVariationUrl}${variationId}/remove_from_favorites/`
}

// Orderlines url
export const getOrderLineUrl = `${clientStoreUrl}orderlines/`

// Update orderlines
export const updateOrderLineUrl = `${getOrderLineUrl}update_orderlines/`


// Pickup addresses

export const pickupAddressUrl = `${clientStoreUrl}pickup-addresses/`

// Orders

export const createOrderUrl = `${clientStoreUrl}orders/`