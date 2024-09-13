import { Container, Dropdown, Form, Modal } from "react-bootstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import {
  AuditGraphBtn,
  CustomChart,
  ExportandAuditFlex,
  FilterContainer, FilterSearchBtn, FullcharComparetHeadBtn, FullchartBody,
  FullchartBodyChartCon, FullchartHead, FullchartHeadBtn,
  FullchartHeadExport, FullchartHeadLeft, GlobalButton,
  GlobalButtoncontainer, LineHr, ModalHead,
  TableInfoDevice
} from "../../style/style"
import { BsStars } from "react-icons/bs"
import {
  RiCloseLine, RiDashboardFill, RiFilePdf2Line,
  RiFolderSharedLine, RiImageLine, RiPrinterLine
} from "react-icons/ri"
import { useEffect, useRef, useState } from "react"
import axios, { AxiosError } from "axios"
import { logtype } from "../../types/log.type"
import { devicesType } from "../../types/device.type"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { PDFViewer } from '@react-pdf/renderer'
import Fullchartpdf from "../../components/pdf/fullchartpdf"
import Images_one from '../../assets/images/Thanes.png'
import html2canvas from 'html2canvas'
import { swalOptimizeChartButtons } from "../../components/dropdown/sweetalertLib"
import { RiArrowRightSLine } from "react-icons/ri"
import toast from "react-hot-toast"
import Apexchart from "../../components/dashboard/apexchart"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { cookies, getDateNow } from "../../constants/constants"
import { responseType } from "../../types/response.type"
import { wardsType } from "../../types/ward.type"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { useTheme } from "../../theme/ThemeProvider"
import ReactToPrint from "react-to-print"
import { PrintButton } from "../../style/components/warranty.styled"
import PageLoading from "../../components/loading/page.loading"

export default function Fullchart() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const [pageNumber, setPagenumber] = useState(1)
  const { Serial, deviceId, expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, hosName, hosImg, userLevel } = cookieDecode
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [logData, setLogData] = useState<logtype[]>([])
  const [devData, setDevData] = useState<devicesType>()
  const { state } = useLocation()
  const { tempMin, tempMax } = state
  const [show, setShow] = useState(false)
  const [convertImage, setConvertImage] = useState('')
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [validationData, setValidationData] = useState<wardsType>()
  const { theme, toggleTheme } = useTheme()

  const handleClose = () => {
    setShow(false)
    if (canvasChartRef.current) {
      canvasChartRef.current.style.width = '100%'
    }
  }

  const handleShow = () => {
    if (logData) {
      exportChart()
      setShow(true)
    } else {
      toast.error("Data not found")
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const fetchWard = async () => {
    try {
      const response = await axios.get<responseType<wardsType>>(`${import.meta.env.VITE_APP_API}/ward/${devData?.wardId}`, { headers: { authorization: `Bearer ${token}` } })
      setValidationData(response.data.data)
    } catch (error) { //up
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message)
      } else {
        console.error('Uknown Error', error)
      }
    }
  }

  useEffect(() => {
    if (devData) {
      fetchWard()
    }
  }, [devData])

  const fetchData = async () => {
    try {
      const responseData = await axios
        .get(`${import.meta.env.VITE_APP_API}/device/${deviceId ? deviceId : cookies.get('devid')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
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
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=day&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
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
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=week&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
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
      const responseData = await axios
        .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=month&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
          headers: { authorization: `Bearer ${token}` }
        })
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
          const responseData = await axios
            .get<responseType<logtype[]>>(`${import.meta.env.VITE_APP_API}/log?filter=${filterDate.startDate},${filterDate.endDate}&devSerial=${Serial ? Serial : cookies.get('devSerial')}`, {
              headers: { authorization: `Bearer ${token}` }
            })
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

  useEffect(() => {
    if (String(deviceId) !== 'undefined' && token) fetchData()
  }, [pageNumber, token, deviceId])

  useEffect(() => {
    if (token) {
      Logday()
    }
  }, [token])

  const exportChart = async () => {
    if (canvasChartRef.current) {
      canvasChartRef.current.style.width = '1645px'
      if (theme.mode === 'dark') toggleTheme()
      await new Promise(resolve => setTimeout(resolve, 500))
      const canvas = canvasChartRef.current
      await html2canvas(canvas).then((canvasImage) => {
        setConvertImage(canvasImage.toDataURL('image/png', 1.0))
      })
    }
  }

  const handleDownload = async (type: string) => {
    if (canvasChartRef.current && tableInfoRef.current) {
      tableInfoRef.current.style.display = 'flex'
      const canvas = canvasChartRef.current
      const promise = html2canvas(canvas).then((canvasImage) => {
        const dataURL = canvasImage.toDataURL(type === 'png' ? 'image/png' : 'image/jpg', 1.0)

        let pagename = ""
        if (pageNumber === 1) {
          pagename = 'Day_Chart'
        } else if (pageNumber === 2) {
          pagename = 'Week_Chart'
        } else {
          pagename = 'Custom_Chart'
        }

        const link = document.createElement('a')
        link.href = dataURL
        link.download = pagename + `${type === 'png' ? '.png' : '.jpg'}`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      tableInfoRef.current.style.display = 'none'

      toast.promise(
        promise,
        {
          loading: 'Downloading',
          success: <span>Downloaded</span>,
          error: <span>Something wrong</span>,
        }
      )
    } else {
      toast.error("Data not found")
    }
  }

  const handleShowEdit = () => {
    const newArray: logtype[] = logData.map(items => {
      const tempMax = items.device.probe[0]?.tempMax
      const tempMin = items.device.probe[0]?.tempMin

      if (tempMax !== undefined && items.tempAvg >= tempMax) {
        return {
          ...items,
          tempAvg: Math.floor(Math.random() * (tempMax - (tempMax) + 1) + (tempMax - 1))
        }
      } else if (tempMin !== undefined && items.tempAvg <= tempMin) {
        return {
          ...items,
          tempAvg: Math.floor(Math.random() * ((tempMin) - tempMin + 1) + tempMin)
        }
      } else {
        return items
      }
    })
    setLogData(newArray)
  }


  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
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
            <span>|</span>
            <FullcharComparetHeadBtn onClick={() => navigate('compare')}>{t('chartCompare')}</FullcharComparetHeadBtn>
          </FullchartHeadLeft>
          <ExportandAuditFlex>
            {
              userLevel !== '3' && <AuditGraphBtn onClick={() => {
                if (logData) {
                  swalOptimizeChartButtons
                    .fire({
                      title: t('alertHeaderWarning'),
                      html: t('optimizeChartText'),
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: t('continueButton'),
                      cancelButtonText: t('closeDialogButton'),
                      reverseButtons: false,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        handleShowEdit()
                      }
                    })
                } else {
                  toast.error("Data not found")
                }
              }}>
                <BsStars />
                {t('optimizeGraph')}
              </AuditGraphBtn>
            }
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
                <Dropdown.Item onClick={handleShow}>
                  <RiFilePdf2Line />
                  <span>PDF</span>
                </Dropdown.Item>
                <LineHr $mg={.5} />
                <Dropdown.Item>
                  <ReactToPrint
                    trigger={() =>
                      <PrintButton>
                        <RiPrinterLine />
                        {t('print')}
                      </PrintButton>}
                    content={() => {
                      if (canvasChartRef.current && tableInfoRef.current) {
                        tableInfoRef.current.style.display = 'flex'
                      }
                      return canvasChartRef.current
                    }}
                    pageStyle={`@page { size: landscape; margin: 5mm; padding: 0mm; }`}
                    onAfterPrint={() => {
                      if (canvasChartRef.current && tableInfoRef.current) {
                        tableInfoRef.current.style.display = 'none'
                      }
                    }}
                  />
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
                  min={devData?.dateInstall.split('T')[0]}
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
            {
              logData.length > 0 ?
                <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
                  <TableInfoDevice ref={tableInfoRef}>
                    <h4>{hosName}</h4>
                    <span>{devData?.devDetail ? devData?.devDetail : '--'} | {devData?.devSerial}</span>
                    <span>{devData?.locInstall ? devData?.locInstall : '- -'}</span>
                  </TableInfoDevice>
                  <Apexchart
                    chartData={logData}
                    devicesData={{
                      tempMin,
                      tempMax
                    }}
                    tempHeight={680}
                    tempWidth={1480}
                  />
                </FullchartBodyChartCon>
                :
                <PageLoading reset={pageNumber} />
            }
          </CustomChart>
          <Modal size={'xl'} show={show} onHide={handleClose} scrollable>
            <Modal.Header>
              <ModalHead>
                <Modal.Title>PDF</Modal.Title>
                <button onClick={handleClose}>
                  <RiCloseLine />
                </button>
              </ModalHead>
            </Modal.Header>
            <Modal.Body>
              {
                convertImage !== '' && devData ?
                  <PDFViewer style={{ width: '100%', height: '100vh' }}>
                    <Fullchartpdf
                      title={'Chart-Report'}
                      image={Images_one}
                      chartIMG={convertImage}
                      dev_sn={devData.devSerial}
                      dev_name={devData.devDetail}
                      hospital={validationData?.hospital.hosName}
                      ward={validationData?.wardName}
                      datetime={String(new Date).substring(0, 25)}
                      hosImg={hosImg}
                    />
                  </PDFViewer>
                  :
                  null
              }
            </Modal.Body>
            <Modal.Footer>
              <GlobalButtoncontainer>
                <GlobalButton $color onClick={handleClose}>
                  {t('closeButton')}
                </GlobalButton>
              </GlobalButtoncontainer>
            </Modal.Footer>
          </Modal>
        </FullchartBody>
      </motion.div>
    </Container>
  )
}
