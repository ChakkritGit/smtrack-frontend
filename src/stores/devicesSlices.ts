import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { devicesType } from "../types/device.type"
import { DeviceState, payloadError } from "../types/redux.type"
import { responseType } from "../types/response.type"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchDevicesData = createAsyncThunk<devicesType[], string>('device/fetchDevicesData', async (token) => {
  const response = await axios.get<responseType<devicesType[]>>(`${import.meta.env.VITE_APP_API}/device`, {
    headers: { authorization: `Bearer ${token}` }
  })
  return response.data.data
})

const initialState: DeviceState = {
  devices: [],
  devicesLoading: false,
  devicesError: '',
}

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.devicesLoading = true
          state.devicesError = ''
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state: DeviceState, action: PayloadAction<devicesType[]>) => {
          state.devicesLoading = false
          if (action.type.includes("fetchDevicesData")) {
            state.devices = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: DeviceState, action: payloadError) => {
          state.devicesLoading = false
          // if (Number(action.error.message.split(' ')[action.error.message.split(' ').length - 1]) === 401) {
          //   cookies.remove('localDataObject', cookieOptions)
          //   cookies.remove('devSerial', cookieOptions)
          //   cookies.remove('devid', cookieOptions)
          //   cookies.remove('selectHos', cookieOptions)
          //   cookies.remove('selectWard', cookieOptions)
          //   cookies.update()
          //   window.location.href = '/login'
          // } else {
          //   state.devicesError = action.error.message
          // }
          state.devicesError = action.error.message
        },
      )
  }
})

export default deviceSlice.reducer