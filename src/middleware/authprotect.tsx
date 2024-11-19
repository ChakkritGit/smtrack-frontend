import { ReactElement, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { CookieType } from '../types/cookie.type'
import { cookieOptions, cookies, decodeCookieObject } from '../constants/constants'
import CryptoJS from "crypto-js"
import { setCookieDecode, setCookieEncode, setDeviceId, setSerial } from '../stores/utilsStateSlice'
import { RootState, storeDispatchType } from '../stores/store'
import { reset } from '../stores/resetAction'

type AuthProps = {
  children: ReactElement
}

const ProtectedRoute = ({ children }: AuthProps) => {
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieEncode } = useSelector((state: RootState) => state.utilsState)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!cookieEncode) return
    try {
      const CookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
      dispatch(setCookieDecode(CookieObject))
    } catch (error) {
      console.error('Decoded error: ', error)
    }
  }, [cookieEncode])

  useEffect(() => {
    const verifyToken = async (cookieEncode: string) => {
      try {
        const cookieObject: CookieType = JSON.parse(decodeCookieObject(cookieEncode).toString(CryptoJS.enc.Utf8))
        if (cookieObject.token) {
          setIsValid(true)
        } else {
          cookies.remove('localDataObject', cookieOptions)
          cookies.remove('devSerial', cookieOptions)
          cookies.remove('devid', cookieOptions)
          cookies.remove('selectHos', cookieOptions)
          cookies.remove('selectWard', cookieOptions)
          cookies.remove('isTms', cookieOptions)
          cookies.update()
          dispatch(reset())
          dispatch(setDeviceId(''))
          dispatch(setSerial(''))
          dispatch(setCookieEncode(''))
          setIsValid(false)
        }
      } catch (error) {
        cookies.remove('localDataObject', cookieOptions)
        cookies.remove('devSerial', cookieOptions)
        cookies.remove('devid', cookieOptions)
        cookies.remove('selectHos', cookieOptions)
        cookies.remove('selectWard', cookieOptions)
        cookies.remove('isTms', cookieOptions)
        cookies.update()
        dispatch(reset())
        dispatch(setDeviceId(''))
        dispatch(setSerial(''))
        dispatch(setCookieEncode(''))
        setIsValid(false)
      }
    }

    if (cookieEncode !== '') {
      verifyToken(cookieEncode)
    } else {
      setIsValid(false)
    }
  }, [cookieEncode, dispatch])

  if (isValid === null) {
    return null
  }

  return isValid ? children : <Navigate to="/login" />
}

export function AuthRoute() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
