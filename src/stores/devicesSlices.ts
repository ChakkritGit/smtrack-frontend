import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { DeviceState, payloadError } from "../types/redux.type"
import { responseType } from "../types/response.type"
import axiosInstance from "../constants/axiosInstance"
import { DevicesType, HomeDeviceType } from "../types/smtrack/devices.type"

export const fetchDevicesData = createAsyncThunk<HomeDeviceType[]>('device/fetchDevicesData', async () => {
  const response = await axiosInstance.get<responseType<DevicesType>>(`${import.meta.env.VITE_APP_API}/devices/device`)
  return response.data.data.devices
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
        (state: DeviceState, action: PayloadAction<HomeDeviceType[]>) => {
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