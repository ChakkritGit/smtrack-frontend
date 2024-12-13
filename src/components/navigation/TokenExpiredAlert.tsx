import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cookieOptions, cookies } from '../../constants/constants'
import { setCookieEncode, setDeviceId, setSerial, setShowAlert } from '../../stores/utilsStateSlice'
import { swalTokenInvalid } from '../../constants/sweetalertLib'
import { RootState } from '../../stores/store'
import { reset } from '../../stores/resetAction'

const TokenExpiredAlert = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { showAlert } = useSelector((state: RootState) => state.utilsState)

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
          dispatch(reset())
          cookies.remove('localDataObject', cookieOptions)
          cookies.remove('devSerial', cookieOptions)
          cookies.remove('devid', cookieOptions)
          cookies.remove('selectHos', cookieOptions)
          cookies.remove('selectWard', cookieOptions)
          cookies.remove('isTms', cookieOptions)
          cookies.update()
          dispatch(setShowAlert(false))
          navigate("/login")
        }
      })
  }, [showAlert])

  return null
}

export default TokenExpiredAlert
