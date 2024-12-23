import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { FilterLogType, TmsDeviceType } from "../../types/tms.type"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { responseType } from "../../types/response.type"
import { AxiosError } from "axios"
import axiosInstance from "../../constants/axiosInstance"
import Swal from "sweetalert2"
import { cookies, getDateNow } from "../../constants/constants"
import { Container, Form } from "react-bootstrap"
import { Breadcrumbs, Typography } from "@mui/material"
import { RiArrowRightSLine, RiDashboardFill, RiFileExcel2Line, RiFileForbidLine } from "react-icons/ri"
import { FilterContainer, FilterSearchBtn, FulltableBody, FulltableBodyChartCon, FulltableContainer, FulltableExportHeadBtn, FulltableHead, FulltableHeadBtn, FulltableHeadLeft } from "../../style/style"
import toast from "react-hot-toast"
import PageLoading from "../../components/loading/page.loading"
import DataTable, { TableColumn } from "react-data-table-component"
import { NoRecordContainer } from "../../style/components/datatable.styled"
import * as XLSX from 'xlsx'

const TmsFullTable = () => {
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { state } = useLocation()
  const { tempMin, tempMax } = state ?? { tempMin: 0, tempMax: 0 }
  const [pageNumber, setPagenumber] = useState(1)
  const [logData, setLogData] = useState<FilterLogType[]>([])
  const [devData, setDevData] = useState<TmsDeviceType>()
  const [tableData, setTableData] = useState<FilterLogType[]>([])
  const { searchQuery, expand, cookieDecode, Serial } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    const filtered = logData.filter((items) =>
      items._time && items._time.toLowerCase().includes(searchQuery.toLowerCase()))
    setTableData(filtered)
  }, [searchQuery, pageNumber, logData])

  const Logcustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' && endDate !== '') {
      if (diffDays <= 31) {
        try {
          setLogData([])
          const responseData = await axiosInstance
            .get<responseType<FilterLogType[]>>(`${import.meta.env.VITE_APP_API}/legacy/graph?filter=${filterDate.startDate},${filterDate.endDate}&sn=${Serial ? Serial : cookies.get('devSerial')}`)
          setLogData(responseData.data.data)
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
      } else {
        Swal.fire({
          title: t('alertHeaderWarning'),
          text: t('customMessageLogData'),
          icon: "warning",
          timer: 3000,
          showConfirmButton: false,
        })
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const fetchData = async () => {
    try {
      const responseData = await axiosInstance
        .get(`${import.meta.env.VITE_APP_API}/legacy/device/${Serial ? Serial : cookies.get('devSerial')}`)
      setDevData(responseData.data.data)
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

  const Logday = async () => {
    setPagenumber(1)
    setLogData([])
    try {
      const responseData = await axiosInstance
        .get<responseType<FilterLogType[]>>(`${import.meta.env.VITE_APP_API}/legacy/graph?filter=day&sn=${Serial ? Serial : cookies.get('devSerial')}`)
      console.log(responseData.data.data)
      setLogData(responseData.data.data)
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

  const Logweek = async () => {
    setPagenumber(2)
    setLogData([])
    try {
      const responseData = await axiosInstance
        .get<responseType<FilterLogType[]>>(`${import.meta.env.VITE_APP_API}/legacy/graph?filter=week&sn=${Serial ? Serial : cookies.get('devSerial')}`)
      setLogData(responseData.data.data)
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

  const Logmonth = async () => {
    setPagenumber(3)
    setLogData([])
    try {
      const responseData = await axiosInstance
        .get<responseType<FilterLogType[]>>(`${import.meta.env.VITE_APP_API}/legacy/graph?filter=month&sn=${Serial ? Serial : cookies.get('devSerial')}`)
      setLogData(responseData.data.data)
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
    if (Serial !== 'undefined' && token) fetchData()
  }, [pageNumber, token, Serial])

  useEffect(() => {
    if (token) {
      Logday()
    }
  }, [token])

  const columns: TableColumn<FilterLogType>[] = useMemo(
    () => [
      {
        name: t('deviceSerialTb'),
        cell: (item) => item.sn,
        sortable: false,
        center: true
      },
      {
        name: t('devicsmtrackTb'),
        cell: (item) => item._value > 0 ? `${item._value.toFixed(2)}°C` : '- -',
        sortable: false,
        center: true
      },
    ], [t])

  const convertArrayOfObjectsToExcel = (object: {
    deviceData: TmsDeviceType | undefined,
    log: FilterLogType[]
  }) => {
    return new Promise<boolean>((resolve, reject) => {
      if (object.deviceData && object.log.length > 0) {
        const newArray = object.log.map((items, index) => {
          return {
            No: index + 1,
            DeviceSN: items.sn,
            DeviceName: object.deviceData?.name,
            TemperatureMin: tempMin,
            TemperatureMax: tempMax,
            Date: new Date(items._time).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC'
            }),
            Time: new Date(items._time).toLocaleString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'UTC'
            }),
            Temperature: items._value.toFixed(2),
          }
        })

        const ws = XLSX.utils.json_to_sheet(newArray)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, String(newArray[0].DeviceSN))

        try {
          XLSX.writeFile(wb, 'smtrack-data-table' + '.xlsx')
          resolve(true)
        } catch (error) {
          reject(false)
        }
      } else {
        reject(false)
      }
    })
  }

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography color="text.primary">{t('pageTable')}</Typography>
      </Breadcrumbs>
      <FulltableHead>
        <FulltableHeadLeft>
          <FulltableHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('chartDay')}</FulltableHeadBtn>
          <FulltableHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('chartWeek')}</FulltableHeadBtn>
          <FulltableHeadBtn $primary={pageNumber === 3} onClick={Logmonth}>{t('month')}</FulltableHeadBtn>
          <FulltableHeadBtn $primary={pageNumber === 4} onClick={() => setPagenumber(4)}>{t('chartCustom')}</FulltableHeadBtn>
        </FulltableHeadLeft>
        <div>
          <FulltableExportHeadBtn onClick={() => {
            toast.promise(
              convertArrayOfObjectsToExcel({
                deviceData: devData,
                log: tableData
              }),
              {
                loading: 'Downloading',
                success: <span>Downloaded</span>,
                error: <span>Something wrong</span>,
              }
            )
          }}>
            <RiFileExcel2Line />
            Excel
          </FulltableExportHeadBtn>
        </div>
      </FulltableHead>
      <FulltableBody $primary={pageNumber !== 4}>
        <FulltableBodyChartCon $primary={expand}>
          {pageNumber === 4 &&
            <FilterContainer>
              <Form.Control
                type="date"
                max={filterDate.endDate !== '' ? filterDate.endDate : getDateNow()}
                value={filterDate.startDate}
                onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
              <Form.Control
                type="date"
                min={filterDate.startDate}
                max={getDateNow()}
                value={filterDate.endDate}
                onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
              <FilterSearchBtn onClick={Logcustom}>{t('searchButton')}</FilterSearchBtn>
            </FilterContainer>
          }{
            tableData.length === 0 ?
              <PageLoading reset={pageNumber} />
              :
              <FulltableContainer>
                <DataTable
                  responsive={true}
                  columns={columns}
                  data={tableData}
                  pagination
                  paginationRowsPerPageOptions={[15, 30, 50, 100, 200, 300, 500]}
                  paginationPerPage={15}
                  noDataComponent={<NoRecordContainer>
                    <RiFileForbidLine size={32} />
                    <h4>{t('nodata')}</h4>
                  </NoRecordContainer>}
                  dense
                  fixedHeader
                  fixedHeaderScrollHeight="calc(100dvh - 250px)"
                />
              </FulltableContainer>
          }
        </FulltableBodyChartCon>
      </FulltableBody>
    </Container>
  )
}

export default TmsFullTable