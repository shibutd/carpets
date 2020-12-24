import { configureStore } from '@reduxjs/toolkit'

import authReducer from './lib/slices/authSlice'


const store = configureStore({
  reducer: {
    auth: authReducer
  },
  devTools: true,
})

export default store
