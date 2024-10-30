import { Container } from "react-bootstrap"
import { DashboardFlex, DashboardHeadFilter, Dashboardanalys } from "../../style/style"
import Dropdown from "../../components/dashboard/dropdown"
import Chart from "../../components/dashboard/chart"
import Devicesinfo from "../../components/dashboard/devicesinfo"
import Table from "../../components/dashboard/table"
import { useDispatch, useSelector } from "react-redux"
import PageLoading from "../../components/loading/page.loading"
import { useEffect } from "react"
import { RootState, storeDispatchType } from "../../stores/store"
import { setDeviceId, setSearchQuery, setSerial } from "../../stores/utilsStateSlice"
import { fetchDevicesLog } from "../../stores/LogsSlice"
import { cookieOptions, cookies } from "../../constants/constants"
import { useNavigate } from "react-router-dom"
import { OfflineDataFlex } from "../../style/components/dashboard.styled"
import { RiBarChartBoxLine, RiTableView } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"

export default function Dashboard() {
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { devicesLogs } = useSelector((state: RootState) => state.logs)
  const { expand, cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { devices } = useSelector((state: RootState) => state.devices)
  const { token } = cookieDecode

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (!token) return
    if (cookies.get('devid') !== 'undefined') return
    if (devices.length === 0) return
    dispatch(fetchDevicesLog({ deviceId: devices[0]?.devId, token }))
    dispatch(setSerial(devices[0]?.devSerial))
    dispatch(setDeviceId(devices[0]?.devId))
    cookies.set('devid', String(devices[0]?.devId), cookieOptions)
  }, [devices, token])

  return (
    <Container fluid>
      <DashboardFlex>
        <DashboardHeadFilter $primary={expand}>
          <Dropdown />
          <FilterHosAndWard />
        </DashboardHeadFilter>
        {
          devicesLogs.log?.length > 0 ?
            <>
              <Devicesinfo
                devicesData={devicesLogs}
                index={0}
              />
              <Dashboardanalys>
                <Chart
                  data={devicesLogs.log.slice(0, 80)}
                  tempMin={devicesLogs.probe[0]?.tempMin}
                  tempMax={devicesLogs.probe[0]?.tempMax}
                />
                <Table
                  data={devicesLogs.log.slice(0, 80)}
                  devSn={devicesLogs.devSerial}
                  devStatus={devicesLogs.devStatus}
                  tempMin={devicesLogs.probe[0]?.tempMin}
                  tempMax={devicesLogs.probe[0]?.tempMax}
                />
              </Dashboardanalys>
            </>
            :
            devicesLogs.log?.length === 0 ?
              <>
                <Devicesinfo
                  devicesData={devicesLogs}
                  index={0}
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
                          onClick={() => navigate(`/dashboard/chart`, { state: { tempMin: devicesLogs.probe[0]?.tempMin, tempMax: devicesLogs.probe[0]?.tempMax } })}>
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
                          onClick={() => navigate(`/dashboard/table`, { state: { tempMin: devicesLogs.probe[0]?.tempMin, tempMax: devicesLogs.probe[0]?.tempMax } })}>
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
