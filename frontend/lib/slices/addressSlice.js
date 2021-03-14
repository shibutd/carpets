import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import axios from 'axios'

import { authAxios } from '../utils/authAxios'
import { userAddressUrl, pickupAddressUrl } from '../../constants'

export const getPickupAddresses = createAsyncThunk(
  'address/getPrickAddressses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(pickupAddressUrl)

      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.response.data})
    }
  }
)

export const createDeliveryAddress = createAsyncThunk(
  'address/createDeliveryAddress',
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
    loading: false,
    error: null,
    selectedAddressType: null,
    selectedAddressId: null,
    selectedAddress: {},
    pickupAddresses: [],
    pickupAddressesLoding: false
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
    // Get Pickup Addresses
    [getPickupAddresses.pending]: (state) => {
      state.pickupAddressesLoding = true
    },
    [getPickupAddresses.fulfilled]: (state, action) => {
      state.pickupAddressesLoding = false
      state.pickupAddresses = action.payload
    },
    [getPickupAddresses.rejected]: (state) => {
      state.pickupAddressesLoding = false
      state.pickupAddresses = []
    },

    // Create Delivery Address
    [createDeliveryAddress.pending]: (state) => {
      state.loading = true
      delete state.error
    },
    [createDeliveryAddress.fulfilled]: (state, action) => {
      const { type, id, ...address } = action.payload
      state.loading = false
      state.selectedAddressType = type
      state.selectedAddressId = id
      state.selectedAddress = address
    },
    [createDeliveryAddress.rejected]: (state, action) => {
      state.loading = false
      state.selectedAddressId = null
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
    pickupAddresses: state.address.pickupAddresses,
    pickupAddressesLoding: state.address.pickupAddressesLoding
  }),
  (state) => state
)

export const { changeAddress, resetAddress } = addressSlice.actions

export default addressSlice.reducer