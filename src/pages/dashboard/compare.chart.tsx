import { Breadcrumbs, Typography } from "@mui/material"
import { Container, Dropdown, Form, Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { RiArrowRightSLine, RiCloseLine, RiDashboardFill, RiFilePdf2Line, RiFolderSharedLine, RiImageLine, RiLoader3Line, RiPrinterLine } from "react-icons/ri"
import { Link } from "react-router-dom"
import CompareChartComponent from "../../components/dashboard/compare.chart.component"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../../components/loading/loading"
import { ExportandAuditFlex, FilterContainer, FilterSearchBtn, FullchartBodyChartCon, FullchartHead, FullchartHeadBtn, FullchartHeadExport, FullchartHeadLeft, GlobalButton, GlobalButtoncontainer, LineHr, ModalHead, TableInfoDevice } from "../../style/style"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import html2canvas from "html2canvas"
import { PDFViewer } from "@react-pdf/renderer"
import Fullchartpdf from "../../components/pdf/fullchartpdf"
import { setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"

const Comparechart = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { hosName, token } = cookieDecode
  const [pageNumber, setPagenumber] = useState(1)
  const canvasChartRef = useRef<HTMLDivElement | null>(null)
  const tableInfoRef = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const [convertImage, setConvertImage] = useState('')
  const [filterDate, setFilterDate] = useState({
    startDate: '',
    endDate: ''
  })
  const [devices, setDevices] = useState<any>([])

  const fetchCompare = async () => {
    try {
      setDevices([])
      const res = await axios.get(`${import.meta.env.VITE_APP_API}/utils/compare`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setDevices(res.data.data)
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

  const fetchCompareCustom = async () => {
    const { endDate, startDate } = filterDate
    let startDateNew = new Date(filterDate.startDate)
    let endDateNew = new Date(filterDate.endDate)
    let timeDiff = Math.abs(endDateNew.getTime() - startDateNew.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if (startDate !== '' || endDate !== '') {
      if (diffDays <= 31) {
        try {
          setDevices([])
          const res = await axios.get(`${import.meta.env.VITE_APP_API}/utils/compare?start=${startDate}&end=${endDate}`, {
            headers: { authorization: `Bearer ${token}` }
          })
          setDevices(res.data.data)
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
    if (!token) return
    fetchCompare()
  }, [token])

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const handleShow = () => {
    if (devices.length > 0) {
      exportChart()
      setShow(true)
    } else {
      toast.error("Data not found")
    }
  }

  const exportChart = async () => {
    if (canvasChartRef.current) {
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

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/dashboard'}>
          <RiDashboardFill fontSize={20} />
        </Link>
        <Typography className="compare-text">{t('chartCompare')}</Typography>
      </Breadcrumbs>
      <FullchartHead>
        <FullchartHeadLeft>
          <FullchartHeadBtn $primary={pageNumber === 1} onClick={() => setPagenumber(1)}>{t('month')}</FullchartHeadBtn>
          <FullchartHeadBtn $primary={pageNumber === 3} onClick={() => setPagenumber(3)}>{t('chartCustom')}</FullchartHeadBtn>
        </FullchartHeadLeft>
        <ExportandAuditFlex>
          <Dropdown>
            <Dropdown.Toggle variant="0" className="border-0 p-0">
              <FullchartHeadExport>
                <RiFolderSharedLine />
                {t('export')}
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
                <RiPrinterLine />
                <span>Print</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ExportandAuditFlex>
      </FullchartHead>
      {pageNumber === 3 &&
        <FilterContainer>
          <Form.Control
            type="date"
            value={filterDate.startDate}
            onChange={(e) => setFilterDate({ ...filterDate, startDate: e.target.value })} />
          <Form.Control
            type="date"
            value={filterDate.endDate}
            onChange={(e) => setFilterDate({ ...filterDate, endDate: e.target.value })} />
          <FilterSearchBtn onClick={() => fetchCompareCustom()}>{t('searchButton')}</FilterSearchBtn>
        </FilterContainer>}
      <FullchartBodyChartCon $primary={expand} ref={canvasChartRef}>
        <TableInfoDevice ref={tableInfoRef}>
          <h4>{hosName}</h4>
        </TableInfoDevice>
        {
          devices.length > 0 ?
            <CompareChartComponent
              chartData={devices} />
            :
            <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
        }
      </FullchartBodyChartCon>
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
            convertImage !== '' ?
              <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <Fullchartpdf
                  title={'Chart-Report'}
                  chartIMG={convertImage}
                  hospital={'devData.ward.group_name'}
                  ward={'devData?.ward.group_name'}
                  dateTime={String(new Date).substring(0, 25)}
                />
              </PDFViewer>
              :
              null
          }
        </Modal.Body>
        <Modal.Footer>
          <GlobalButtoncontainer>
            <GlobalButton onClick={handleClose}>
              {t('closeButton')}
            </GlobalButton>
          </GlobalButtoncontainer>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Comparechart