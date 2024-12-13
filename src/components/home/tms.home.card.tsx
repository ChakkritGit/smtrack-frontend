import { useTranslation } from "react-i18next"
import {
  RiDoorClosedLine,
  RiPlugLine,
  RiTempColdLine,
} from "react-icons/ri"
import { CountStyle, HomeCardItem } from "../../style/components/home.styled"
import { TmsCountType } from "../../types/tms.type"

type HomeCardData = {
  counts?: TmsCountType
}

function TmsHomeCard({ counts }: HomeCardData) {
  const { t } = useTranslation()

  const cardItems = [
    { key: '1', label: t('countProbe'), count: counts?.temp, icon: <RiTempColdLine /> },
    { key: '2', label: t('countDoor'), count: counts?.door, icon: <RiDoorClosedLine /> },
    { key: '3', label: t('countPlug'), count: counts?.plug, icon: <RiPlugLine /> }
  ]

  return (
    <>
      {cardItems.map(({ key, label, count, icon }) => (
        <HomeCardItem
          key={key}
          $disableClick
        >
          <span>{label}</span>
          <CountStyle $primary={count ? count > 0 : false}>{count}</CountStyle>
          <div>
            <span>{t('countNormalUnit')}</span>
            {icon}
          </div>
        </HomeCardItem>
      ))}
    </>
  )
}

export default TmsHomeCard
