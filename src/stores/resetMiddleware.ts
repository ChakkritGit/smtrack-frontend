// src/store/resetMiddleware.ts
import { Middleware } from '@reduxjs/toolkit'
import { reset } from './resetAction'

const resetMiddleware: Middleware = (store) => (next) => (action) => {
  if (reset.match(action)) {
    store.dispatch({ type: 'RESET' })
  }
  return next(action)
}

export default resetMiddleware
