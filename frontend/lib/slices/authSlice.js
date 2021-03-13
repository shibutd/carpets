import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import axios from 'axios'

import {
  userCreateUrl,
  tokenObtainUrl,
  tokenRefreshUrl,
} from '../../constants'
import { decodeJWT } from '../utils/decode-jwt'


export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        tokenObtainUrl, {
          email: userData.email,
          password: userData.password,
        },
      )
      localStorage.setItem('userInfo', JSON.stringify(response.data))

      const { access } = response.data
      const accessTokenDecoded = decodeJWT(access)

      return { userEmail: accessTokenDecoded.email, accessToken: access }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.data })
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        userCreateUrl, {
          email: userData.email,
          password: userData.password,
        },
      )
      localStorage.setItem('userInfo', JSON.stringify(response.data))

      const { access } = response.data
      const accessTokenDecoded = decodeJWT(access)

      return { userEmail: accessTokenDecoded.email, accessToken: access }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.data })
    }
  }
)

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (refreshToken, thunkAPI) => {
    try {
      const response = await axios.post(
        tokenRefreshUrl, { refresh: refreshToken },
      )
      const { access } = response.data

      localStorage.setItem(
        'userInfo',
        JSON.stringify({ access, refresh: refreshToken })
      )
      const accessTokenDecoded = decodeJWT(access)

      return { userEmail: accessTokenDecoded.email, accessToken: access }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.response.data })
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loadingStatus: 'loading',
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo')
      state.user = null
      state.token = null
      state.loadingStatus = 'loaded'
    },
  },
  extraReducers: {
    // LOGIN
    [login.pending]: (state) => {
      delete state.error
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload.userEmail
      state.token = action.payload.accessToken
      state.loadingStatus = 'loaded'
    },
    [login.rejected]: (state, action) => {
      state.user = null
      state.error = action.payload?.error.detail
      state.loadingStatus = 'loaded'
    },

    // REGISTER
    [registerUser.pending]: (state) => {
      delete state.error
    },
    [registerUser.fulfilled]: (state, action) => {
      state.user = action.payload.userEmail
      state.token = action.payload.accessToken
      state.loadingStatus = 'loaded'
    },
    [registerUser.rejected]: (state, action) => {
      state.user = null
      state.error = action.payload.error.email
      state.loadingStatus = 'loaded'
    },

    // REFRESH TOKEN
    [refresh.pending]: (state) => {
      delete state.error
    },
    [refresh.fulfilled]: (state, action) => {
      state.user = action.payload.userEmail
      state.token = action.payload.accessToken
      state.loadingStatus = 'loaded'
    },
    [refresh.rejected]: (state) => {
      localStorage.removeItem('userInfo')
      state.user = null
      state.loadingStatus = 'loaded'
    }
  }
})

export const selectUser = createSelector(
  (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    error: state.auth.error,
    loadingStatus: state.auth.loadingStatus,
  }),
  (state) => state
)

export const { logout } = authSlice.actions

export default authSlice.reducer