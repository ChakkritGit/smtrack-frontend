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

export function HideSetting() {
  const { tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
  return (
    role === 'USER' || role === 'LEGACY_ADMIN' || role === 'LEGACY_USER' ? <Notacess /> : <Outlet />
  )
}

export function HideFlashFW() {
  const { tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
  return (
    role !== 'SUPER' ? <Notacess /> : <Outlet />
  )
}