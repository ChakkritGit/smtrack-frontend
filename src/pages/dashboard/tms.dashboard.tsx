import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import { Dashboardanalys, DashboardFlex, DashboardHeadFilter } from "../../style/style"
import { Container } from "react-bootstrap"
import Dropdown from "../../components/dashboard/dropdown"
import FilterHosWardTemporary from "../../components/dropdown/filter.hos.ward.temp"
import { useEffect, useState } from "react"
import { OfflineDataFlex } from "../../style/components/dashboard.styled"
import { RiBarChartBoxLine, RiTableView } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import PageLoading from "../../components/loading/page.loading"
import TmsChart from "../../components/dashboard/tms.chart"
import TmsDeviceInfo from "../../components/dashboard/tms.devicesinfo"
import { setSearchQuery, setSerial } from "../../stores/utilsStateSlice"
import TmsTable from "../../components/dashboard/tms.table"
import { fetchTmsDeviceLog } from "../../stores/tms.device.log"
import { cookieOptions, cookies } from "../../constants/constants"

const TmsDashboard = () => {
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { expand, cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { devices } = useSelector((state: RootState) => state.tmsDevice)
  const { devicesLog } = useSelector((state: RootState) => state.tmsLog)
  const { token } = cookieDecode
  const [filterById, setFilterById] = useState({
    hosId: '',
    wardId: ''
  })
  const { hosId, wardId } = filterById

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (!token) return
    if (cookies.get('devSerial')) return
    if (devices.length > 0) {
      dispatch(fetchTmsDeviceLog(devices[0]?.sn))
      dispatch(setSerial(devices[0]?.sn))
      cookies.set('devSerial', String(devices[0]?.sn), cookieOptions)
    }
  }, [devices, token])

  return (
    <Container fluid>
      <DashboardFlex>
        <DashboardHeadFilter $primary={expand}>
          <Dropdown
            hosId={hosId}
            wardId={wardId}
          />
          <FilterHosWardTemporary
            filterById={filterById}
            setFilterById={setFilterById}
          />
        </DashboardHeadFilter>
        {
          devicesLog.log?.length > 0 ?
            <>
              <TmsDeviceInfo
                devicesData={devicesLog}
              />
              <Dashboardanalys>
                <TmsChart
                  logs={devicesLog.log}
                  tempMin={devicesLog.minTemp}
                  tempMax={devicesLog.maxTemp}
                />
                <TmsTable
                  data={devicesLog.log}
                  devSn={devicesLog.sn}
                  tempMax={devicesLog.maxTemp}
                  tempMin={devicesLog.minTemp}
                />
              </Dashboardanalys>
            </>
            :
            devicesLog.log?.length === 0 ?
              <>
                <TmsDeviceInfo
                  devicesData={devicesLog}
                />
                <OfflineDataFlex>
                  <span>{t('todayNoData')}</span>
                  <div>
                    <div>
                      <div>
                        <RiBarChartBoxLine size={62} />
                      </div>
                      <div>
                        <span>{t('pageChart')}</span>
                        <button
                          onClick={() => navigate(`/dashboard/chart`, { state: {} })}>
                          {t('seeLastData')}
                        </button>
                      </div>
                    </div>
                    <div>
                      <div>
                        <RiTableView size={62} />
                      </div>
                      <div>
                        <span>{t('pageTable')}</span>
                        <button
                          onClick={() => navigate(`/dashboard/table`, { state: {} })}>
                          {t('seeLastData')}
                        </button>
                      </div>
                    </div>
                  </div>
                </OfflineDataFlex>
              </>
              :
              <PageLoading />
        }
      </DashboardFlex>

    </Container>
  )
}

export default TmsDashboard