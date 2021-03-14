import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import axios from 'axios'

import { clientCategoryUrl } from '../../constants'

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(clientCategoryUrl)

      return response.data
    } catch (error) {
      return rejectWithValue({ error: error.response.data })
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: []
  },
  reducers: {},
  extraReducers: {
    [getCategories.fulfilled]: (state, action) => {
      state.categories = action.payload
    },
    [getCategories.rejected]: (state) => {
      state.categories = []
    },
  }
})

export const selectCategory = createSelector(
  (state) => ({
    categories: state.category.categories
  }),
  (state) => state
)

export default categorySlice.reducer