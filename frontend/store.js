import { configureStore } from '@reduxjs/toolkit'

import authReducer from './lib/slices/authSlice'
import cartReducer from './lib/slices/cartSlice'
import addressReducer from './lib/slices/addressSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
  },
  devTools: true,
})

export default store
