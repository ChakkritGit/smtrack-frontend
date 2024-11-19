import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { devicesType } from "../types/device.type"
import { LogState, payloadError } from "../types/redux.type"
import { responseType } from "../types/response.type"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchDevicesLog = createAsyncThunk<devicesType, { deviceId: string, token: string }>('deviceLogs/fetchDevicesLog', async ({ deviceId, token }) => {
  const response = await axios.get<responseType<devicesType>>(`${import.meta.env.VITE_APP_API}/device/${deviceId}`, {
    headers: { authorization: `Bearer ${token}` }
  })
  return response.data.data
})

const initialState: LogState = {
  devicesLogs: {} as devicesType,
  logLoading: false,
  logError: '',
}

const logSlice = createSlice({
  name: 'deviceLogs',
  initialState,
  reducers: {
    setDefaultLogs: (state, action: PayloadAction<devicesType>) => {
      state.devicesLogs = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.logLoading = true
          state.logError = ''
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state: LogState, action: PayloadAction<devicesType>) => {
          state.logLoading = false
          if (action.type.includes("fetchDevicesLog")) {
            state.devicesLogs = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: LogState, action: payloadError) => {
          state.logLoading = false
          state.logError = action.error.message
        },
      )
  }
})

export const { setDefaultLogs } = logSlice.actions

export default logSlice.reducer