import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { usersType } from "../types/user.type"
import { responseType } from "../types/response.type"
import axios from "axios"
import { UserState, payloadError } from "../types/redux.type"
// import { cookieOptions, cookies } from "../constants/constants"

export const fetchUserData = createAsyncThunk<usersType[], string>('user/fetchUserData', async (token) => {
  const response = await axios.get<responseType<usersType[]>>(`${import.meta.env.VITE_APP_API}/user`, {
    headers: { authorization: `Bearer ${token}` }
  })
  return response.data.data
})

const initialState: UserState = {
  userDaata: [],
  userLoading: false,
  userError: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.userLoading = true
          state.userError = ''
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state: UserState, action: PayloadAction<usersType[]>) => {
          state.userLoading = false
          if (action.type.includes("fetchUserData")) {
            state.userDaata = action.payload
          }
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state: UserState, action: payloadError) => {
          state.userLoading = false
          // if (Number(action.error.message.split(' ')[action.error.message.split(' ').length - 1]) === 401) {
          //   cookies.remove('localDataObject', cookieOptions)
          //   cookies.remove('devSerial', cookieOptions)
          //   cookies.remove('devid', cookieOptions)
          //   cookies.remove('selectHos', cookieOptions)
          //   cookies.remove('selectWard', cookieOptions)
          //   cookies.update()
          //   window.location.href = '/login'
          // } else {
          //   state.userError = action.error.message
          // }
          state.userError = action.error.message
        },
      )
  }
})

export default userSlice.reducer