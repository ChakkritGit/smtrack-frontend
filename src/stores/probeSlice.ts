import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { responseType } from "../types/response.type"
import axios from "axios"
import { ProbeState, payloadError } from "../types/redux.type"
import { probeType } from "../types/probe.type"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchProbeData = createAsyncThunk<probeType[], string>('probe/fetchProbeData', async (token) => {
  const response = await axios.get<responseType<probeType[]>>(`${import.meta.env.VITE_APP_API}/probe`, {
    headers: { authorization: `Bearer ${token}` }
  })
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
          // if (Number(action.error.message.split(' ')[action.error.message.split(' ').length - 1]) === 401) {
          //   cookies.remove('localDataObject', cookieOptions)
          //   cookies.remove('devSerial', cookieOptions)
          //   cookies.remove('devid', cookieOptions)
          //   cookies.remove('selectHos', cookieOptions)
          //   cookies.remove('selectWard', cookieOptions)
          //   cookies.update()
          //   window.location.href = '/login'
          // } else {
          //   state.probeError = action.error.message
          // }
          state.probeError = action.error.message
        },
      )
  }
})

export default probeSlice.reducer