import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { devicesType } from "../types/device.type"
import { DeviceState, payloadError } from "../types/redux.type"
import { responseType } from "../types/response.type"
import axiosInstance from "../constants/axiosInstance"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchDevicesData = createAsyncThunk<devicesType[]>('device/fetchDevicesData', async () => {
  const response = await axiosInstance.get<responseType<devicesType[]>>(`${import.meta.env.VITE_APP_API}/device`)
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
          state.devicesError = action.error.message
        },
      )
  }
})

export default deviceSlice.reducer