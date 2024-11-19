import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { payloadError, TmsDeviceState } from "../types/redux.type"
import { responseType } from "../types/response.type"
import { TmsDeviceType } from "../types/tms.type"

export const fetchTmsDevice = createAsyncThunk<TmsDeviceType[], string>('newDev/fetchNewDevice', async (token) => {
  const response = await axios.get<responseType<TmsDeviceType[]>>(`${import.meta.env.VITE_APP_API}/device`, {
    headers: { authorization: `Bearer ${token}` }
  })
  return response.data.data
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