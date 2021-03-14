import { configureStore } from '@reduxjs/toolkit'

import authReducer from './lib/slices/authSlice'
import cartReducer from './lib/slices/cartSlice'
import addressReducer from './lib/slices/addressSlice'
import categoryReducer from './lib/slices/categorySlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    category: categoryReducer,
  },
  devTools: true,
})

export default store
