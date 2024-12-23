import { RiAlarmWarningFill, RiCloseLargeFill, RiCloseLine, RiDoorClosedLine, RiDoorOpenLine, RiNotification2Line } from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import { notificationType } from "../../types/notification.type"
import { ModalHead, NotificationBadge, NotificationContainer } from "../../style/style"
import { Modal } from "react-bootstrap"
import { CountUp } from "countup.js"
import { useDispatch, useSelector } from "react-redux"
import { responseType } from "../../types/response.type"
import { AxiosError } from "axios"
import Notificationdata from "../../components/notification/notificationdata"
import notificationSound from "../../assets/sounds/notification.mp3"
import { RootState, storeDispatchType } from "../../stores/store"
import { setNotidata, setShowAlert } from "../../stores/utilsStateSlice"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { ToastContainer } from "../../style/components/toast.styled"
import { useTheme } from "../../theme/ThemeProvider"
import { TbPlugConnected, TbPlugConnectedX, TbReportAnalytics } from "react-icons/tb"
import { MdOutlineSdCard, MdOutlineSdCardAlert } from "react-icons/md"
import { FaTemperatureArrowDown, FaTemperatureArrowUp, FaTemperatureEmpty } from "react-icons/fa6"
import { extractValues } from "../../constants/constants"
import axiosInstance from "../../constants/axiosInstance"

export default function Notification() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { socketData, soundMode, popUpMode, cookieDecode, notiData, transparent, isTms, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { role } = tokenDecode
  const [number, setNumber] = useState(0)
  const [show, setShow] = useState(false)
  const countupRef = useRef(null)
  const notiSound = new Audio(notificationSound)
  const { theme } = useTheme()
  let isPlaying = false

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const fetchData = async () => {
    const baseUrl = role === "LEGACY_ADMIN" || role === "LEGACY_USER" || isTms ? `${import.meta.env.VITE_APP_API}/legacy/templog/alert/notification` : `${import.meta.env.VITE_APP_API}/notification`
    try {
      const responseData = await axiosInstance
        .get<responseType<notificationType[]>>(baseUrl)
      dispatch(setNotidata(responseData.data.data))
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  useEffect(() => {
    setNumber(notiData.filter(items => !items.notiStatus).length)
  }, [notiData])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [socketData, token])

  useEffect(() => {
    const isMessageValid = socketData?.message?.toLowerCase()
    if (socketData &&
      !popUpMode &&
      !soundMode &&
      isMessageValid &&
      !isMessageValid.includes('device offline') &&
      !isMessageValid.includes('device online')) {
      if (!isPlaying) {
        notiSound.play()
        isPlaying = true

        setTimeout(() => {
          isPlaying = false
        }, 3000)
      }
    }

    if (socketData && !popUpMode && !socketData.message.includes('Device offline') && !socketData.message.includes('Device online')) {
      toast((_t) => (
        <ToastContainer>
          <div>
            <span>{socketData.device ? socketData.device : '- -'}</span>
            <span>{changText(socketData.message)}</span>
            <span>
              {new Date(socketData.time).toLocaleString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'UTC'
              })}
            </span>
          </div>
          <button
            onClick={() => toast.dismiss(_t.id)}
          >
            <RiCloseLargeFill size={24} />
          </button>
        </ToastContainer>
      ), {
        icon: changIcon(socketData.message),
        duration: 10000,
        style: {
          backgroundColor: theme.mode === 'dark' ? transparent ? 'rgba(53, 53, 53, .8)' : 'rgba(53, 53, 53, 1)' : transparent ? 'rgba(255, 255, 255, .8)' : 'rgba(255, 255, 255, 1)',
          borderRadius: 'var(--border-radius-small)',
          padding: '.5rem .7rem',
          backdropFilter: transparent ? 'blur(13px)' : 'unset',
          WebkitBackdropFilter: transparent ? 'blur(13px)' : 'unset',
          width: 'max-content'
        }
      })
    }
  }, [socketData])

  const changIcon = (text: string) => {
    if (text.split(":")[1]?.substring(1, 5) === "DOOR") {
      if (text.split(" ")[3] === "opened") {
        return <RiDoorOpenLine size={28} fill='var(--danger-color)' />
      } else {
        return <RiDoorClosedLine size={28} fill='var(--main-color)' />
      }
    } else if (text.split(" ")[0] === "Power") {
      if (text.split(" ")[1] === "off") {
        return <TbPlugConnectedX size={28} fill='var(--danger-color)' />
      } else {
        return <TbPlugConnected size={28} fill='var(--main-color)' />
      }
    } else if (text.split(" ")[0] === "SDCard") {
      if (text.split(" ")[1] === "failed") {
        return <MdOutlineSdCardAlert size={28} fill='var(--danger-color)' />
      } else {
        return <MdOutlineSdCard size={28} fill='var(--main-color)' />
      }
    } else if (text.split(" ")[0]?.substring(0, 5) === "PROBE") {
      if (text.split(" ")[4] === "high") {
        return <FaTemperatureArrowUp size={28} fill='var(--danger-color)' />
      } else if (text.split(" ")[4] === "low") {
        return <FaTemperatureArrowDown size={28} fill='var(--danger-color)' />
      } else {
        return <FaTemperatureEmpty size={28} fill='var(--main-color)' />
      }
    } else if (text.split("/")[0] === "REPORT") {
      return <TbReportAnalytics size={28} fill='var(--main-color)' />
    } else {
      return <RiAlarmWarningFill size={28} fill='var(--danger-color)' />
    }
  }

  const changText = (text: string) => {
    if (text.split(":")[1]?.substring(1, 5) === "DOOR") {
      const probe = text.split(' ')
      const probeNumber = probe[0].replace('PROBE', '')?.substring(0, 1)
      const doorNumber = probe[1].replace('DOOR', '')
      const status = probe[3] === 'opened' ? t('stateOn') : t('stateOff')
      return `${t('deviceProbeTb')} ${probeNumber} ${t('doorNum')} ${doorNumber} ${status}`
    } else if (text.split(" ")[0] === "Power") {
      if (text.split(" ")[1] === "off") {
        return t('plugProblem')
      } else {
        return t('plugBackToNormal')
      }
    } else if (text.split(" ")[0] === "SDCard") {
      if (text.split(" ")[1] === "failed") {
        return t('SdCardProblem')
      } else {
        return t('SdCardBackToNormal')
      }
    } else if (text.split(" ")[0]?.substring(0, 5) === "PROBE") {
      if (text.split(" ")[4] === "high") {
        return t('tempHigherLimmit')
      } else if (text.split(" ")[4] === "low") {
        return t('tempBelowLimmit')
      } else {
        return t('tempBackToNormal')
      }
    } else if (text.split("/")[0] === "REPORT") {
      return `${t('reportText')}/ ${t('devicsmtrackTb')}: ${extractValues(text)?.temperature ? extractValues(text)?.temperature : '- -'}°C, ${t('deviceHumiTb')}: ${extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'}%`
    } else {
      return text
    }
  }

  useEffect(() => {
    if (countupRef.current) {
      const numAnim = new CountUp(countupRef.current, number)
      numAnim.start()
    }
  }, [number])

  return (
    <>
      <NotificationContainer $primary={number > 0} onClick={openModal}>
        <RiNotification2Line />
        {
          number > 0 ?
            <NotificationBadge $primary={number > 100}>
              <span ref={countupRef}></span>
            </NotificationBadge>
            :
            <></>
        }
      </NotificationContainer>
      <Modal scrollable size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('titleNotification')}
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body style={{ padding: 'unset' }}>
          <Notificationdata
            data={notiData}
            funcfetch={fetchData}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}
