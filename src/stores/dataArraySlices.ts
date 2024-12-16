import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { wardsType } from "../types/ward.type"
import { devicesType } from "../types/device.type"
import { hospitalsType } from "../types/hospital.type"
import { DataArrayStore, payloadError } from "../types/redux.type"
import { responseType } from "../types/response.type"
import axiosInstance from "../constants/axiosInstance"

const initialState: DataArrayStore = {
  device: {
    devicesFilter: []
  },
  hospital: {
    hospitalsData: []
  },
  ward: {
    wardData: []
  },
  arrayLoading: false,
  arrayError: ''
}

export const filtersDevices = createAsyncThunk<devicesType[]>('array/filters', async () => {
  const response = await axiosInstance.get<responseType<devicesType[]>>(`${import.meta.env.VITE_APP_API}/device`)
  return response.data.data
})

export const fetchHospitals = createAsyncThunk<hospitalsType[]>('array/fetchHospitals', async () => {
  const response = await axiosInstance.get<responseType<hospitalsType[]>>(`${import.meta.env.VITE_APP_API}/hospital`)
  return response.data.data
})

export const fetchWards = createAsyncThunk<wardsType[]>('array/fetchWards', async () => {
  const response = await axiosInstance.get<responseType<wardsType[]>>(`${import.meta.env.VITE_APP_API}/ward`)
  return response.data.data
})

const arraySlice = createSlice({
  name: 'array',
  initialState,
  reducers: {
    setFilterDevice: (state, action: PayloadAction<devicesType[]>) => {
      state.device.devicesFilter = action.payload
    },
    setHospitalsData: (state, action: PayloadAction<hospitalsType[]>) => {
      state.hospital.hospitalsData = action.payload
    },
    setWardData: (state, action: PayloadAction<wardsType[]>) => {
      state.ward.wardData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.arrayLoading = true
          state.arrayError = ''
        },
      )
      .addMatcher(
        (action: PayloadAction) => action.type.endsWith("/fulfilled"),
        (state: DataArrayStore, action: PayloadAction<devicesType[] | hospitalsType[] | wardsType[]>) => {
          state.arrayLoading = false
          if (action.type.includes("filters")) {
            state.device.devicesFilter = action.payload as devicesType[]
          }
          if (action.type.includes("fetchHospitals")) {
            state.hospital.hospitalsData = action.payload as hospitalsType[]
          }
          if (action.type.includes("fetchWards")) {
            state.ward.wardData = action.payload as wardsType[]
          }
        },
      )
      .addMatcher(
        (action: PayloadAction) => action.type.endsWith("/rejected"),
        (state: DataArrayStore, action: payloadError) => {
          state.arrayLoading = false
          state.arrayError = action.error.message
        },
      )
  },
})

export const { setFilterDevice, setHospitalsData, setWardData } = arraySlice.actions

export default arraySlice.reducer