import { Breadcrumbs, Typography } from "@mui/material"
import { Container, Dropdown, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { RiArrowRightSLine, RiDashboardFill, RiFilePdf2Line, RiFolderSharedLine, RiImageLine, RiLoader2Line, RiPriceTag3Line } from "react-icons/ri"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CustomChart, ExportandAuditFlex, FilterContainer, FilterSearchBtn, FullchartBody, FullchartBodyChartCon, FullchartHead, FullchartHeadBtn, FullchartHeadExport, FullchartHeadLeft, LineHr, TableInfoDevice } from "../../style/style"
import Swal from "sweetalert2"
import Loading from "../../components/loading/loading"
import { WaitExportImage } from "../../style/components/page.loading"
import { useEffect, useMemo, useRef, useState } from "react"
import TmsApexChart from "../../components/dashboard/tmsapexfull"
import { TmsDeviceType, TmsLogType } from "../../types/tms.type"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import PageLoading from "../../components/loading/page.loading"
import { cookies, getDateNow, styleElement } from "../../constants/constants"
import html2canvas from "html2canvas"
import toast from "react-hot-toast"
import ImagesOne from '../../assets/images/Thanes.png'
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { responseType } from "../../types/response.type"
import axiosInstance from "../../constants/axiosInstance"
import { AxiosError } from "axios"

const TmsFullChart = () => {
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { state } = useLocation()
  const navigate = useNavigate()
  const { tempMin, tempMax } = state ?? { tempMin: 0, tempMax: 0 }
  const { Serial, deviceId, expand, cookieDecode, userProfile } = useSelector((state: RootState) => state.utilsState)
  const [logData, setLogData] = useState<TmsLogType[]>([])
  const [devData, setDevData] = useState<TmsDeviceType>()
  const [pageNumber, setPagenumber] = useState(1)
  const [isloading, setIsLoading] = useState(false)
  const [showDataLabel, setShowDataLabel] = useState(false)
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const { token } = cookieDecode

  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)

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
            .get<responseType<TmsLogType[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devSerial=${Serial ? Serial : cookies.get('devSerial')}`)
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
        .get(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : cookies.get('devid')}`)
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
        .get<responseType<TmsLogType[]>>(`${import.meta.env.VITE_APP_API}/log?filter=day&devSerial=${Serial ? Serial : cookies.get('devSerial')}`)
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
        .get<responseType<TmsLogType[]>>(`${import.meta.env.VITE_APP_API}/log?filter=week&devSerial=${Serial ? Serial : cookies.get('devSerial')}`)
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
        .get<responseType<TmsLogType[]>>(`${import.meta.env.VITE_APP_API}/log?filter=month&devSerial=${Serial ? Serial : cookies.get('devSerial')}`)
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
    if (deviceId !== 'undefined' && token) fetchData()
  }, [pageNumber, token, deviceId])

  useEffect(() => {
    if (token) {
      Logday()
    }
  }, [token])

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const exportChart = () => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          if (canvasChartRef.current) {
            canvasChartRef.current.style.width = '1480px'
            canvasChartRef.current.style.height = '680px'
            canvasChartRef.current.style.color = 'black'

            document.head.appendChild(styleElement)

            await new Promise((resolve) => setTimeout(resolve, 500))
            const canvas = canvasChartRef.current

            html2canvas(canvas).then((canvasImage) => {
              resolve(canvasImage.toDataURL('image/png', 1.0))

              document.head.removeChild(styleElement)
            }).catch((error) => {
              reject(error)
            })
          }
        } catch (error) {
          reject(error)
        }
      }, 600)
    })
  }

  const handleDownload = async (type: string) => {
    if (canvasChartRef.current && tableInfoRef.current) {
      document.head.appendChild(styleElement)

      tableInfoRef.current.style.display = 'flex'
      tableInfoRef.current.style.color = 'black'
      canvasChartRef.current.style.color = 'black'

      const canvas = canvasChartRef.current

      const promise = html2canvas(canvas, { scale: 2 }).then((canvasImage) => {
        const dataURL = canvasImage.toDataURL(type === 'png' ? 'image/png' : 'image/jpg', 1.0);

        let pagename = ''
        if (pageNumber === 1) {
          pagename = 'Day_Chart'
        } else if (pageNumber === 2) {
          pagename = 'Week_Chart'
        } else {
          pagename = 'Custom_Chart'
        }

        const link = document.createElement('a')
        link.href = dataURL
        link.download = `${pagename}${type === 'png' ? '.png' : '.jpg'}`

        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link)
      }).catch((error) => {
        console.error('Error generating image:', error)
        throw new Error('Failed to download the image')
      }).finally(() => {
        document.head.removeChild(styleElement)
        if (!tableInfoRef.current) return
        tableInfoRef.current.style.display = 'none'
      })

      toast.promise(
        promise,
        {
          loading: 'Downloading',
          success: <span>Downloaded</span>,
          error: <span>Something went wrong</span>,
        }
      )
    } else {
      toast.error("Data not found")
    }
  }

  useEffect(() => {
    if (isloading) {
      (async () => {
        try {
          const waitExport = await exportChart()
          setIsLoading(false)
          navigate('/dashboard/chart/preview', {
            state: {
              title: 'Chart-Report',
              ward: '',
              image: ImagesOne,
              hospital: '',
              devSn: devData?.sn,
              devName: devData?.name,
              chartIMG: waitExport,
              dateTime: String(new Date).substring(0, 25),
              hosImg: userProfile?.ward.hospital.hosPic,
              tempMin: tempMin,
              tempMax: tempMax,
            },
          })
        } catch (error) {
          setIsLoading(false);
          Swal.fire({
            title: t('alertHeaderError'),
            text: t('descriptionErrorWrong'),
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      })()
    }
  }, [isloading])

  const chartContent = useMemo(() => {
    if (logData.length > 0) {
      return (
        <FullchartBodyChartCon key={String(isloading)} $primary={expand} ref={canvasChartRef}>
          <TableInfoDevice ref={tableInfoRef}>
            <h4>{userProfile?.ward.hospital.hosName}</h4>
            <span>{devData?.name ? devData?.name : '--'} | {devData?.name}</span>
          </TableInfoDevice>
          <TmsApexChart
            chartData={logData}
            devicesData={{
              tempMin,
              tempMax
            }}
            tempHeight={680}
            tempWidth={1480}
            isExport={isloading}
            showDataLabel={showDataLabel}
          />
        </FullchartBodyChartCon>
      )
    } else {
      return <PageLoading reset={pageNumber} />
    }
  }, [logData, isloading, expand, userProfile?.ward.hospital.hosName, devData, tempMin, tempMax, showDataLabel, pageNumber])

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography color="text.primary">{t('pageChart')}</Typography>
      </Breadcrumbs>
      <FullchartHead>
        <FullchartHeadLeft>
          <FullchartHeadBtn $primary={pageNumber === 1} onClick={Logday}>{t('chartDay')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 2} onClick={Logweek}>{t('chartWeek')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 3} onClick={Logmonth}>{t('month')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 4} onClick={() => { setPagenumber(4) }}>{t('chartCustom')}</FullchartHeadBtn>
        </FullchartHeadLeft>
        <ExportandAuditFlex>
          <FullchartHeadExport onClick={() => setShowDataLabel(!showDataLabel)}>
            <RiPriceTag3Line size={24} />
            {showDataLabel ? t('hideDataLabel') : t('showDataLabel')}
          </FullchartHeadExport>
          <Dropdown>
            <Dropdown.Toggle variant="0" className="border-0 p-0">
              <FullchartHeadExport>
                <RiFolderSharedLine />
                {t('exportFile')}
              </FullchartHeadExport>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDownload('png')}>
                <RiImageLine />
                <span>PNG</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDownload('jpg')}>
                <RiImageLine />
                <span>JPG</span>
              </Dropdown.Item>
              <LineHr $mg={.5} />
              <Dropdown.Item onClick={async () => {
                setIsLoading(true)
                if (logData.length === 0) {
                  Swal.fire({
                    title: t('alertHeaderWarning'),
                    text: t('dataNotReady'),
                    icon: "warning",
                    timer: 2000,
                    showConfirmButton: false,
                  })
                  setIsLoading(false)
                }
              }}>
                <RiFilePdf2Line />
                <span>PDF</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ExportandAuditFlex>
      </FullchartHead>
      <FullchartBody $primary={pageNumber !== 4}>
        <CustomChart>
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
            </FilterContainer>}
          {chartContent}
        </CustomChart>
      </FullchartBody>
      {isloading && <WaitExportImage>
        <Loading loading={true} title={t('loading')} icn={<RiLoader2Line fill="white" />} />
      </WaitExportImage>}
    </Container>
  )
}

export default TmsFullChart