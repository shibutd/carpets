import { configureStore } from '@reduxjs/toolkit'

import authReducer from './lib/slices/authSlice'
import cartReducer from './lib/slices/cartSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: true,
})

export default store
