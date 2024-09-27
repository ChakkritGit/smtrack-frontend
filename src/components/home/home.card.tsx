import { Dispatch, SetStateAction } from "react"
import { devicesType } from "../../types/device.type"
import { useTranslation } from "react-i18next"
import { RiDoorClosedLine, RiFolderSettingsLine, RiListSettingsLine, RiPlugLine, RiSdCardMiniLine, RiShieldCheckLine, RiSignalWifi1Line, RiTempColdLine } from "react-icons/ri"
import { notificationType } from "../../types/notification.type"
import { CountStyle, HomeCardItem } from "../../style/components/home.styled"

type HomeCardData = {
  deviceData: devicesType[],
  deviceDataFilter: devicesType[],
  wardId: string,
  cardActive: string,
  setCardActive: Dispatch<SetStateAction<string>>,
  setOnFilteres: Dispatch<SetStateAction<boolean>>,
}

function HomeCard(homeCardData: HomeCardData) {
  const { t } = useTranslation()
  const { cardActive, deviceData, setCardActive, wardId, setOnFilteres } = homeCardData

  const filter: devicesType[] = wardId !== 'WID-DEVELOPMENT' ? deviceData.filter((f) => f.wardId === wardId) : deviceData

  const getSum = (key: keyof NonNullable<devicesType['_count']>): number =>
    filter.reduce((acc, devItems) => acc + (devItems._count?.[key] ?? 0), 0)

  const getFilteredCount = (predicate: (n: notificationType) => boolean): number =>
    filter.flatMap(i => i.noti).filter(predicate).length

  const countState = {
    temp: getFilteredCount(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])),
    door: getFilteredCount(n => n.notiDetail.split('/')[0].substring(0, 5) === 'PROBE' && n.notiDetail.split('/')[2].substring(0, 5) === 'ON'),
    connect: getSum('log'),
    plug: getFilteredCount(n => n.notiDetail.split('/')[0] === 'AC'),
    scCard: getFilteredCount(n => n.notiDetail.split('/')[0] === 'SD'),
    adjust: getSum('history'),
    repair: getSum('repair'),
    warranties: getSum('warranty')
  }

  return (
    <>
      <HomeCardItem
        $primary={cardActive === '1'}
        onClick={() => {
          if (cardActive === '1') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('1')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countProbe')}</span>
        <CountStyle $primary={countState.temp > 0}>{countState.temp}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiTempColdLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '2'}
        onClick={() => {
          if (cardActive === '2') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('2')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countDoor')}</span>
        <CountStyle $primary={countState.door > 0}>{countState.door}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiDoorClosedLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '3'}
        onClick={() => {
          if (cardActive === '3') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('3')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countConnect')}</span>
        <CountStyle $primary={countState.connect > 0}>{countState.connect}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiSignalWifi1Line />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '4'}
        onClick={() => {
          if (cardActive === '4') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('4')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countPlug')}</span>
        <CountStyle $primary={countState.plug > 0}>{countState.plug}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiPlugLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '5'}
        onClick={() => {
          if (cardActive === '5') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('5')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countSdCard')}</span>
        <CountStyle $primary={countState.scCard > 0}>{countState.scCard}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiSdCardMiniLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '6'}
        onClick={() => {
          if (cardActive === '6') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('6')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countAdjust')}</span>
        <CountStyle $primary={countState.adjust > 0}>{countState.adjust}</CountStyle>
        <div>
          <span>{t('countNormalUnit')}</span>
          <RiListSettingsLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '7'}
        onClick={() => {
          if (cardActive === '7') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('7')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countRepair')}</span>
        <CountStyle $primary={countState.repair > 0}>{countState.repair}</CountStyle>
        <div>
          <span>{t('countDeviceUnit')}</span>
          <RiFolderSettingsLine />
        </div>
      </HomeCardItem>
      <HomeCardItem
        $primary={cardActive === '8'}
        onClick={() => {
          if (cardActive === '8') {
            setCardActive('')
            setOnFilteres(false)
          } else {
            setCardActive('8')
            setOnFilteres(true)
          }
        }}
      >
        <span>{t('countWarranty')}</span>
        <CountStyle $primary={countState.warranties > 0}>{countState.warranties}</CountStyle>
        <div>
          <span>{t('countDeviceUnit')}</span>
          <RiShieldCheckLine />
        </div>
      </HomeCardItem>
    </>
  )
}

export default HomeCard