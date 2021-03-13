import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import {
  addToCartUrl,
  removeFromCartSingleUrl,
  removeFromCartUrl,
  getOrderLineUrl,
  updateOrderLineUrl,
} from '../../constants'
import { authAxios } from '../utils/authAxios'
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from '../utils/localStorageUtils'


export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ id }, { dispatch, getState, rejectWithValue }) => {
    try {
      const axios = await authAxios(dispatch, getState().auth)
      const response = await axios.post(
        addToCartUrl(id)
      )
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.response.data })
    }
  }
)

export const removeSingleFromCartAsync = createAsyncThunk(
  'cart/removeSingleFromCartAsync',
  async ({ id }, { dispatch, getState, rejectWithValue }) => {
    try {
      const axios = await authAxios(dispatch, getState().auth)
      const response = await axios.post(
        removeFromCartSingleUrl(id)
      )
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.response.data })
    }
  }
)

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ id }, { dispatch, getState, rejectWithValue }) => {
    try {
      const axios = await authAxios(dispatch, getState().auth)
      const response = await axios.post(
        removeFromCartUrl(id)
      )
      return response.data
    } catch (error) {
      console.log(error)
      return rejectWithValue({ error: error.response.data })
    }
  }
)

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (_, { dispatch, getState, requestId, rejectWithValue }) => {
    const {
      auth: { user },
      cart: { userCart, loading, currentRequestId },
  } = getState()

    // Restrict new update request if one already exists
    if (loading && requestId !== currentRequestId) {
      return
    }

    if (!user) {
      return getFromLocalStorage('userCart', [])
    }

    try {
      // Trying to update cart existing on server with local cart
      const axios = await authAxios(dispatch, getState().auth)
      await axios({
        method: 'post',
        url: updateOrderLineUrl,
        data: userCart,
      })
    } catch (error) {
      // If error received, update cart from localstorage
      return getFromLocalStorage('userCart')
    }

    try {
      const axios = await authAxios(dispatch, getState().auth)
      const response = await axios.get(
        getOrderLineUrl
      )
      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.response.data })
    }
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    userCart: [],
    loading: false,
    error: null,
  },

  reducers: {
    addToCartSync: (state, action) => {
      const variation = action.payload
      const product = state.userCart.find(x =>
        x.variation.id === variation.id
      )

      if (product && product.quantity < 99) {
        const newItem = { variation, quantity: product.quantity + 1 }
        state.userCart = state.userCart.map(x =>
          x.variation.id === newItem.variation.id ? newItem : x
        )
      } else if (!product) {
        state.userCart.push({ variation, quantity: 1 })
      }
      saveToLocalStorage('userCart', state.userCart)
    },

    removeSingleFromCartSync: (state, action) => {
      const variation = action.payload
      const product = state.userCart.find(x => (
        x.variation.id === variation.id
      ))

      if (product && product.quantity > 1) {
        const newItem = { variation, quantity: product.quantity - 1 }
        state.userCart = state.userCart.map(x =>
          x.variation.id === newItem.variation.id ? newItem : x
        )
      }
      saveToLocalStorage('userCart', state.userCart)
    },

    removeFromCartSync: (state, action) => {
      const variation = action.payload
      state.userCart = state.userCart.filter(x =>
        x.variation.id !== variation.id
      )
      saveToLocalStorage('userCart', state.userCart)
    },
    resetCart: (state) => {
      state.userCart = []
    }
  },

  extraReducers: {
    [addToCartAsync.pending]: (state, action) => {
      state.loading = true
      delete state.error

      const position = state.userCart.findIndex(x =>
        x.variation.id === action.meta.arg.id
      )
      if (position !== -1 && state.userCart[position].quantity < 99) {
        const product = state.userCart[position]
        const newItem = { ...product, quantity: product.quantity + 1 }

        state.userCart = state.userCart.map(x =>
          x.variation.id === newItem.variation.id ? newItem : x
        )
        state.product = product
      }
      state.position = position
    },
    [addToCartAsync.fulfilled]: (state, action) => {
      state.loading = false

      if (state.position !== -1) {
        state.userCart.splice(state.position, 1, action.payload)
        delete state.product
      } else {
        state.userCart.push(action.payload)
      }
      delete state.position
    },
    [addToCartAsync.rejected]: (state, action) => {
      state.loading = false
      state.error = action.payload.error

      if (state.position !== -1) {
        state.userCart.splice(state.position, 1, state.product)
        delete state.product
      }
      delete state.position
    },

    [removeSingleFromCartAsync.pending]: (state, action) => {
      delete state.error
      const position = state.userCart.findIndex(x =>
        x.variation.id === action.meta.arg.id
      )

      if (position !== -1 && state.userCart[position].quantity > 1) {
        const product = state.userCart[position]
        const newItem = { ...product, quantity: product.quantity - 1 }

        state.userCart = state.userCart.map(x =>
          x.variation.id === newItem.variation.id ? newItem : x
        )
        state.position = position
        state.product = product
      }
    },
    [removeSingleFromCartAsync.fulfilled]: (state, action) => {
      state.userCart.splice(state.position, 1, action.payload)
      delete state.position
      delete state.product
    },
    [removeSingleFromCartAsync.rejected]: (state, action) => {
      state.error = action.payload.error

      if (state.position !== -1) {
        state.userCart.splice(state.position, 1, state.product)
        delete state.product
      }
      delete state.position
    },

    [removeFromCartAsync.pending]: (state, action) => {
      const position = state.userCart.findIndex(x =>
        x.variation.id === action.meta.arg.id
      )

      if (position !== -1) {
        state.userCart.splice(position, 1)
        state.product = state.userCart[position]
        state.position = position
      }
    },
    [removeFromCartAsync.fulfilled]: (state) => {
      delete state.product
      delete state.position
    },
    [removeFromCartAsync.rejected]: (state) => {
      state.userCart.splice(state.position, 0, state.product)
      delete state.product
      delete state.position
    },

    [syncCart.pending]: (state, action) => {
      state.loading = true
      state.currentRequestId = action.meta.requestId
    },
    [syncCart.fulfilled]: (state, action) => {
      state.loading = false
      state.userCart = action.payload || []
      delete state.currentRequestId
    },
    [syncCart.rejected]: (state) => {
      state.loading = false
      delete state.currentRequestId
    },
  }
})

export const selectCart = createSelector(
  (state) => ({
    userCart: state.cart.userCart,
    loading: state.cart.loading,
    error: state.cart.error,
  }),
  (state) => state
)

export const {
  addToCartSync,
  removeSingleFromCartSync,
  removeFromCartSync,
  resetCart,
} = cartSlice.actions

export default cartSlice.reducer