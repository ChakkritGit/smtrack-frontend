import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { payloadError, TmsDeviceState } from "../types/redux.type"
import { responseType } from "../types/response.type"
import { FetchDeviceType, TmsDeviceType } from "../types/tms.type"
import axiosInstance from "../constants/axiosInstance"

export const fetchTmsDevice = createAsyncThunk<TmsDeviceType[], string>('newDev/fetchNewDevice', async () => {
  const response = await axiosInstance.get<responseType<FetchDeviceType>>(`http://192.168.0.74:8080/legacy/device`)
  return response.data.data.devices
})

const initialState: TmsDeviceState = {
  devices: [],
  devicesLoading: false,
  devicesError: '',
}

const tmsDeviceSlice = createSlice({
  name: 'newDev',
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
        (state: TmsDeviceState, action: PayloadAction<TmsDeviceType[]>) => {
          state.devicesLoading = false
          if (action.type.includes("fetchNewDevice")) {
            state.devices = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: TmsDeviceState, action: payloadError) => {
          state.devicesLoading = false
          state.devicesError = action.error.message
        },
      )
  }
})

export default tmsDeviceSlice.reducer