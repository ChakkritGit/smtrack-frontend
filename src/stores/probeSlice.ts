import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { responseType } from "../types/response.type"
import { ProbeState, payloadError } from "../types/redux.type"
import { probeType } from "../types/probe.type"
import axiosInstance from "../constants/axiosInstance"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchProbeData = createAsyncThunk<probeType[]>('probe/fetchProbeData', async () => {
  const response = await axiosInstance.get<responseType<probeType[]>>(`${import.meta.env.VITE_APP_API}/probe`)
  return response.data.data
})

const initialState: ProbeState = {
  probeData: [],
  probeLoading: false,
  probeError: '',
}

const probeSlice = createSlice({
  name: 'probe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.probeLoading = true
          state.probeError = ''
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state: ProbeState, action: PayloadAction<probeType[]>) => {
          state.probeLoading = false
          if (action.type.includes("fetchProbeData")) {
            state.probeData = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: ProbeState, action: payloadError) => {
          state.probeLoading = false
          state.probeError = action.error.message
        },
      )
  }
})

export default probeSlice.reducer