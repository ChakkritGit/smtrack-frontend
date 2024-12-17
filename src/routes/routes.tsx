import { RouterProvider } from "react-router-dom"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, storeDispatchType } from '../stores/store'
import { setTokenDecode } from '../stores/utilsStateSlice'
import toast, { useToasterStore } from 'react-hot-toast'
import { jwtDecode } from 'jwt-decode'
import { jwtToken } from '../types/component.type'
import { router } from "./create.routes"

export default function RoutesComponent() {
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode, isTms } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { role } = tokenDecode
  const { toasts } = useToasterStore()
  const toastLimit = 5

  const decodeToken = async () => {
    const decoded: jwtToken = await jwtDecode(token)
    dispatch(setTokenDecode(decoded))
  }

  useEffect(() => {
    if (!token) return
    decodeToken()
  }, [token])

  useEffect(() => {
    toasts
      .filter((toasts) => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach((toasts) => toast.dismiss(toasts.id))
  }, [toasts])

  return (
    <RouterProvider
      router={router(role, isTms)}
    />
  )
}