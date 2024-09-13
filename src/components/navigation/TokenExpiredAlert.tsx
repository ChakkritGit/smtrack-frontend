import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../constants/constants'
import { setCookieEncode, setDeviceId, setSerial, setShowAlert } from '../../stores/utilsStateSlice'
import { swalTokenInvalid } from '../dropdown/sweetalertLib'
import { DeviceStateStore, UtilsStateStore } from '../../types/redux.type'

const TokenExpiredAlert = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showAlert } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  useEffect(() => {
    swalTokenInvalid.fire({
      title: t('tokenExpired'),
      text: t('tokenExpiredText'),
      icon: "error",
      confirmButtonText: t('confirmButton'),
      backdrop: true,
      allowEscapeKey: false,
      allowOutsideClick: false
    })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(setCookieEncode(''))
          dispatch(setDeviceId(''))
          dispatch(setSerial(''))
          cookies.remove('localDataObject', cookieOptions)
          cookies.remove('devSerial', cookieOptions)
          cookies.remove('devid', cookieOptions)
          cookies.remove('selectHos', cookieOptions)
          cookies.remove('selectWard', cookieOptions)
          cookies.update()
          dispatch(setShowAlert(false))
          navigate("/login")
        }
      })
  }, [dispatch, cookies, navigate, t, showAlert])

  return null
}

export default TokenExpiredAlert
