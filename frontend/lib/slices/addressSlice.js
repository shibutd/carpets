import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'

import { authAxios } from '../utils/authAxios'
import { userAddressUrl } from '../../constants'


export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (address, { dispatch, getState, rejectWithValue }) => {
    try {
      const axios = await authAxios(dispatch, getState().auth)

      const response = await axios({
        method: 'post',
        url: userAddressUrl,
        data: address,
      })

      return {type: 'delivery', ...response.data}
    } catch (error) {
      return rejectWithValue({ error: error.response.data})
    }
  }
)

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addressType: null,
    addressId: null,
    address: {},
    loading: false,
    error: null,
  },
  reducers: {
    changeAddress: (state, action) => {
      const { type, id, ...address } = action.payload
      state.addressType = type
      state.addressId = id
      state.address = address
    },
    resetAddress: (state) => {
      state.addressType = null
      state.addressId = null
      state.address = {}
    }
  },
  extraReducers: {
    [createAddress.pending]: (state) => {
      state.loading = true
      delete state.error
    },
    [createAddress.fulfilled]: (state, action) => {
      console.log(action.payload)
      const { type, id, ...address } = action.payload
      state.loading = false
      state.addressType = type
      state.addressId = id
      state.address = address
    },
    [createAddress.rejected]: (state, action) => {
      state.loading = false
      state.addressId = null
      state.error = action.payload.error.detail
    },
  }
})

export const selectAddress = createSelector(
  (state) => ({
    addressType: state.address.addressType,
    addressId: state.address.addressId,
    address: state.address.address,
    loading: state.address.loading,
    error: state.address.error,
  }),
  (state) => state
)

export const { changeAddress, resetAddress } = addressSlice.actions

export default addressSlice.reducer