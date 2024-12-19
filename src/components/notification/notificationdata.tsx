import axios, { AxiosError } from "axios"
import { Noticontainer, NotiflexOne, NotiflexTwo } from "../../style/style"
import { notificationType } from "../../types/notification.type"
import Loading from "../loading/loading"
import { RiAlarmWarningFill, RiDoorClosedLine, RiDoorOpenLine, RiFileCloseLine, RiSignalWifi3Line, RiSignalWifiErrorLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { NotificationBody, NotiHead, NotiHeadBtn } from "../../style/components/notification"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { FaTemperatureArrowDown, FaTemperatureArrowUp } from "react-icons/fa6"
import { TbPlugConnected, TbPlugConnectedX, TbReportAnalytics } from "react-icons/tb"
import { MdOutlineSdCard, MdOutlineSdCardAlert } from "react-icons/md"
import { extractValues } from "../../constants/constants"
import { TmsNotificationType } from "../../types/tms/notification"
import { IoMdNotificationsOutline } from "react-icons/io"

type notilist = {
  data: notificationType[],
  funcfetch: () => void
}

interface listNotiProps {
  notiData: notificationType,
  index: number
}

export default function Notificationdata(notilist: notilist) {
  const { t } = useTranslation()
  const { data, funcfetch } = notilist
  const [pageState, setPageState] = useState(1)
  const [filterNoti, setFilterNoti] = useState<notificationType[]>([])
  const { cookieDecode, transparent, isTms, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { token, hosId } = cookieDecode
  const { role } = tokenDecode

  const setRead = async (notiID: string) => {
    try {
      await axios
        .patch(`${import.meta.env.VITE_APP_API}/notification/${notiID}`,
          {
            notiStatus: true
          }, {
          headers: { authorization: `Bearer ${token}` }
        })
      funcfetch()
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error: ', error)
      }
    }
  }

  const setReadAll = async (notiID: string) => {
    try {
      await axios
        .patch(`${import.meta.env.VITE_APP_API}/notification/${notiID}`,
          {
            notiStatus: true
          }, {
          headers: { authorization: `Bearer ${token}` }
        })
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Unknown Error: ', error)
      }
    }
  }

  const subTextNotiDetails = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      const probe = text.split('/')
      const probeNumber = probe[0].replace('PROBE', '')
      const doorNumber = probe[1].replace('DOOR', '')
      const status = probe[2] === 'ON' ? t('stateOn') : t('stateOff')
      return `${t('deviceProbeTb')} ${probeNumber} ${t('doorNum')} ${doorNumber} ${status}`
    } else if (text.split('/')[0] === 'TEMP') {
      if (text.split('/')[1] === 'OVER') {
        return t('tempHigherLimmit')
      } else if (text.split('/')[1] === 'LOWER') {
        return t('tempBelowLimmit')
      } else {
        return t('tempBackToNormal')
      }
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return t('plugBackToNormal')
      } else {
        return t('plugProblem')
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return t('SdCardProblem')
      } else {
        return t('SdCardBackToNormal')
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return `${t('reportText')}/ ${t('deviceTempTb')}: ${extractValues(text)?.temperature ? extractValues(text)?.temperature : '- -'}°C, ${t('deviceHumiTb')}: ${extractValues(text)?.humidity ? extractValues(text)?.humidity : '- -'}%`
    } else if (text.split('/')[0] === "INTERNET") {
      if (text.split('/')[1] === "ON") {
        return t('InternetProblem')
      } else {
        return t('InternetBackToNormal')
      }
    } else {
      return text
    }
  }

  const subTextNotiDetailsIcon = (text: string) => {
    if (text.split('/')[0] === 'PROBE1') {
      const probe = text.split('/')
      return probe[2] === 'ON' ? <RiDoorOpenLine size={24} /> : <RiDoorClosedLine size={24} />
    } else if (text.split('/')[0] === 'TEMP') {
      if (text.split('/')[1] === 'OVER') {
        return <FaTemperatureArrowUp size={24} />
      } else if (text.split('/')[1] === 'LOWER') {
        return <FaTemperatureArrowDown size={24} />
      } else {
        return <RiAlarmWarningFill size={24} />
      }
    } else if (text.split('/')[0] === 'AC') {
      if (text.split('/')[1] === 'ON') {
        return <TbPlugConnected size={24} />
      } else {
        return <TbPlugConnectedX size={24} />
      }
    } else if (text.split('/')[0] === 'SD') {
      if (text.split('/')[1] === 'ON') {
        return <MdOutlineSdCardAlert size={24} />
      } else {
        return <MdOutlineSdCard size={24} />
      }
    } else if (text.split('/')[0] === 'REPORT') {
      return <TbReportAnalytics size={24} />
    } else if (text.split('/')[0] === "INTERNET") {
      if (text.split('/')[1] === "ON") {
        return <RiSignalWifiErrorLine size={24} />
      } else {
        return <RiSignalWifi3Line size={24} />
      }
    } else {
      return <RiAlarmWarningFill size={24} />
    }
  }

  const ListNotiTSX = ({ notiData, index }: listNotiProps) => {
    const { notiId, notiStatus, notiDetail, createAt, device } = notiData
    return <Noticontainer $primary={!notiStatus} $readed={!notiStatus} key={index} onClick={() => !notiStatus && setRead(notiId)}>
      <NotiflexOne $primary={!notiStatus}>
        <div>
          <div>
            {subTextNotiDetailsIcon(notiDetail)}
          </div>
          <strong>{subTextNotiDetails(notiDetail)}</strong>
        </div>
        <span>{createAt.substring(11, 16)}</span>
      </NotiflexOne>
      <NotiflexTwo>
        <span>{device.devDetail}</span>
      </NotiflexTwo>
    </Noticontainer>
  }

  const TmsListNotiTSX = ({ notiData, index }: { notiData: TmsNotificationType, index: number }) => {
    const { message, createdAt, mcuId } = notiData
    return <Noticontainer $primary={true} $readed={false} key={index}>
      <NotiflexOne $primary={true}>
        <div>
          <div>
            <IoMdNotificationsOutline size={24} />
          </div>
          <strong>{message}</strong>
        </div>
        <span>{createdAt.substring(11, 16)}</span>
      </NotiflexOne>
      <NotiflexTwo>
        <span>{mcuId}</span>
      </NotiflexTwo>
    </Noticontainer>
  }

  useEffect(() => {
    const filtered = data.filter((f) => f)
    setFilterNoti(filtered)
  }, [hosId, data])

  const readAllNoti = () => {
    if (filterNoti.length === 0) return
    filterNoti.forEach(async (items) => {
      if (items.notiStatus === false) {
        await setReadAll(items.notiId)
      }
    })
    funcfetch()
  }

  return (
    <>
      {
        role === "LEGACY_ADMIN" || role === "LEGACY_USER" || isTms ?
          <NotificationBody>
            {
              data.length > 0 ?
                data.map((items, index) => (
                  <TmsListNotiTSX
                    key={index}
                    index={index}
                    notiData={items as unknown as TmsNotificationType}
                  />
                ))
                :
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
            }
          </NotificationBody>
          :
          <>
            <NotiHead $primary={transparent}>
              <div>
                <NotiHeadBtn $primary={pageState === 1} onClick={() => setPageState(1)}>{t('notRead')}</NotiHeadBtn>
                <NotiHeadBtn $primary={pageState === 2} onClick={() => setPageState(2)}>{t('Readed')}</NotiHeadBtn>
                <NotiHeadBtn $primary={pageState === 3} onClick={() => setPageState(3)}>{t('notificationAll')}</NotiHeadBtn>
              </div>
              <div>
                {
                  pageState !== 2 && <button onClick={readAllNoti}>{t('readAll')}</button>
                }
              </div>
            </NotiHead>
            <NotificationBody $primary={filterNoti.length === 0}>
              {
                pageState === 1 ?
                  filterNoti.length > 0 ?
                    (() => {
                      const filteredData = filterNoti.filter(items => items.notiStatus === false)
                      return filteredData.length > 0 ? (
                        filteredData.map((items, index) => (
                          <ListNotiTSX
                            key={index}
                            index={index}
                            notiData={items}
                          />
                        ))
                      ) :
                        <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    })()
                    :
                    <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  :
                  pageState === 2 ?
                    filterNoti.length > 0 ?
                      (() => {
                        const filteredData = filterNoti.filter(items => items.notiStatus === true)
                        return filteredData.length > 0 ? (
                          filteredData.map((items, index) => (
                            <ListNotiTSX
                              key={index}
                              index={index}
                              notiData={items}
                            />
                          ))
                        ) :
                          <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                      })()
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    :
                    filterNoti.length > 0 ?
                      (() => {
                        return filterNoti.length > 0 ? (
                          filterNoti.map((items, index) => (
                            <ListNotiTSX
                              key={index}
                              index={index}
                              notiData={items}
                            />
                          ))
                        ) :
                          <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                      })()
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
              }
            </NotificationBody>
          </>
      }
    </>
  )
}
