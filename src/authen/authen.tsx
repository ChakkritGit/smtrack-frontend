import { Outlet, Navigate } from "react-router-dom"
import Login from "../pages/login/login"
import Notacess from "../components/permission/notacess"
import { useSelector } from "react-redux"
import { RootState } from "../stores/store"

export function Islogout() {
  const { cookieEncode } = useSelector((state: RootState) => state.utilsState)

  if (cookieEncode !== '') {
    return <Navigate to="/" />
  }

  return <Login />
}

export function Hidesetting() {
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { userLevel } = cookieDecode
  return (
    userLevel === '3' || userLevel === '4' ? <Notacess /> : <Outlet />
  )
}

export function HideFlashFW() {
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { userLevel } = cookieDecode
  return (
    userLevel !== '0' ? <Notacess /> : <Outlet />
  )
}