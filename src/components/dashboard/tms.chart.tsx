import { useTranslation } from "react-i18next"
import { ChartCardHeah, ChartCardHeahBtn, ChartContainer } from "../../style/style"
import { TmsLogType } from "../../types/tms.type"
import { RiFullscreenLine } from "react-icons/ri"
import TmsApexFullChat from "./tms.apex.fullchart"
import { cookieOptions, cookies } from "../../constants/constants"
import { useNavigate } from "react-router-dom"


type ChartData = {
  logs: TmsLogType[],
  tempMin: number | undefined,
  tempMax: number | undefined
}

const TmsChart = (chartData: ChartData) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logs } = chartData

  const openFullChart = () => {
    cookies.set('devSerial', logs ? logs[0].mcuId : '', cookieOptions)
    navigate(`/dashboard/chart`, { state: {} })
    window.scrollTo(0, 0)
  }

  return (
    <ChartContainer>
      <ChartCardHeah>
        <span>{t('pageChart')}</span>
        <ChartCardHeahBtn onClick={openFullChart}>
          <RiFullscreenLine />
        </ChartCardHeahBtn>
      </ChartCardHeah>
      <TmsApexFullChat
        logs={logs}
        tempHeight={460}
        tempWidth={undefined}
        devicesData={{
          tempMin: chartData.tempMin,
          tempMax: chartData.tempMax
        }}
      />
    </ChartContainer>
  )
}

export default TmsChart