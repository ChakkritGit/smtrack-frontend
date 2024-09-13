// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import resetMiddleware from './resetMiddleware'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(resetMiddleware),
  devTools: import.meta.env.VITE_APP_NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type storeDispatchType = typeof store.dispatch
