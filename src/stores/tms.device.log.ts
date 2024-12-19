import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { payloadError, TmsDeviceLogState } from "../types/redux.type"
import { responseType } from "../types/response.type"
import { TmsDeviceType } from "../types/tms.type"
import axiosInstance from "../constants/axiosInstance"

export const fetchTmsDeviceLog = createAsyncThunk<TmsDeviceType, string>('tmsLogs/fetchTmsLog', async (serial) => {
  const response = await axiosInstance.get<responseType<TmsDeviceType>>(`${import.meta.env.VITE_APP_API}/legacy/device/${serial}`)
  return response.data.data
})

const initialState: TmsDeviceLogState = {
  devicesLog: {} as TmsDeviceType,
  devicesLoading: false,
  devicesError: '',
}

const tmsDeviceLogSlice = createSlice({
  name: 'tmsLogs',
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
        (state: TmsDeviceLogState, action: PayloadAction<TmsDeviceType>) => {
          state.devicesLoading = false
          if (action.type.includes("fetchTmsLog")) {
            state.devicesLog = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: TmsDeviceLogState, action: payloadError) => {
          state.devicesLoading = false
          state.devicesError = action.error.message
        },
      )
  }
})

export default tmsDeviceLogSlice.reducer