import { Container, Modal } from "react-bootstrap"
import { DelWarrantyButton, DetailFlex, DetailWarranty, FormBtn, FormFlexBtn, ModalHead, WarrantyBody, WarrantyHead, WarrantyHeadBtn } from "../../style/style"
import { useEffect, useRef, useState } from "react"
import Loading from "../../components/loading/loading"
import { useTranslation } from "react-i18next"
import { RiCloseLine, RiDeleteBin2Line, RiFileCloseLine, RiInformationLine, RiLoader3Line, RiPrinterLine } from "react-icons/ri"
import DataTable, { TableColumn } from "react-data-table-component"
import ReactToPrint from "react-to-print"
import Printwarranty from "./printwarranty"
import { useDispatch, useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import axios, { AxiosError } from "axios"
import { warrantyType } from "../../types/warranty.type"
import { responseType } from "../../types/response.type"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import Addwarranty from "./addwarranty"
import { setRefetchdata, setSearchQuery, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"

interface dataTableProps {
  warrantyData: warrantyType[]
}

export default function Warranty() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [pagenumber, setpagenumber] = useState(1)
  const { searchQuery, cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token, userLevel } = cookieDecode
  const [show, setshow] = useState(false)
  const [deviceDetails, setDevicedetails] = useState<warrantyType[]>([])
  const [warrantyData, setWarrantyData] = useState<warrantyType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const componentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    dispatch(setSearchQuery(''))

    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [pagenumber])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get<responseType<warrantyType[]>>(`${import.meta.env.VITE_APP_API}/warranty`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setWarrantyData(response.data.data)
      setIsLoading(false)
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchData()
  }, [token])

  const devicesArray = warrantyData.filter((items) => items.device.devSerial.includes(searchQuery) || items.devName.includes(searchQuery))

  const expiredArray = devicesArray.filter((items) => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    // Use the expiredDate directly
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining <= 0
  })

  const onwarrantyArray = devicesArray.filter((items) => {
    const today = new Date()
    const expiredDate = new Date(items.expire)
    // Use the expiredDate directly
    const timeDifference = expiredDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysRemaining >= 0
  })

  const openmodal = (warrId: string) => {
    setDevicedetails(warrantyData.filter((items) => items.warrId === warrId))
    setshow(true)
  }

  const closemodal = () => {
    setshow(false)
  }

  const deleteWarranty = async (wId: string) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_API}/warranty/${wId}`, {
        headers: { authorization: `Bearer ${token}` }
      })
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
      fetchData()
      dispatch(setRefetchdata(!reFetchData))
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const columns: TableColumn<warrantyType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceSerialTb'),
      selector: (items) => items.device.devSerial,
      sortable: false,
      center: true,
    },
    {
      name: t('deviceDate'),
      selector: (items) => `${new Date(items.device.dateInstall).toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      })} ${new Date(items.device.dateInstall).toLocaleString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      })}`,
      sortable: false,
      center: true,
    },
    {
      name: t('deviceWarrantyTb'),
      cell: ((items) => {
        const today = new Date()
        const expiredDate = new Date(items.expire)
        // Use the expiredDate directly
        const timeDifference = expiredDate.getTime() - today.getTime()
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

        let remainingDays = daysRemaining
        let years = 0
        let months = 0

        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        while (remainingDays >= 365) {
          if (isLeapYear(today.getFullYear() + years)) {
            if (remainingDays >= 366) {
              remainingDays -= 366
              years++
            } else {
              break
            }
          } else {
            remainingDays -= 365
            years++
          }
        }

        let currentMonth = today.getMonth()
        while (remainingDays >= daysInMonth[currentMonth]) {
          if (currentMonth === 1 && isLeapYear(today.getFullYear() + years)) {
            if (remainingDays >= 29) {
              remainingDays -= 29
              months++
            } else {
              break
            }
          } else {
            remainingDays -= daysInMonth[currentMonth]
            months++
          }
          currentMonth = (currentMonth + 1) % 12
        }

        return <span>
          {daysRemaining > 0
            ? years > 0
              ? `${years} ${t('year')} ${months} ${t('month')} ${remainingDays} ${t('day')}`
              : months > 0
                ? `${months} ${t('month')} ${remainingDays} ${t('day')}`
                : `${remainingDays} ${t('day')}`
            : t('tabWarrantyExpired')}
        </span>
      }),
      sortable: false,
      center: true,
    },
    {
      name: t('action'),
      cell: ((items) => {
        return <DetailFlex>
          <DetailWarranty
            key={items.warrId}
            onClick={() => openmodal(items.warrId)}>
            <RiInformationLine size={16} />
          </DetailWarranty>
          {
            userLevel !== '2' && userLevel !== '3' && <>
              <Addwarranty
                pagestate="edit"
                warData={items}
                fetchData={fetchData}
              />
              <DelWarrantyButton onClick={() =>
                swalWithBootstrapButtons
                  .fire({
                    title: t('deleteWarranty'),
                    text: t('deleteWarrantyText'),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      deleteWarranty(items.warrId)
                    }
                  })}>
                <RiDeleteBin2Line size={16} />
              </DelWarrantyButton>
            </>
          }
        </DetailFlex>
      }),
      sortable: false,
      center: true,
    },
  ]

  const DataTableComponent = ({ warrantyData }: dataTableProps) => (
    <DataTable
      responsive={true}
      columns={columns}
      data={warrantyData}
      pagination
      paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
      paginationPerPage={10}
      dense
      fixedHeader
      fixedHeaderScrollHeight="calc(100dvh - 320px)"
    />
  )

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <WarrantyHead>
          <div>
            <WarrantyHeadBtn $primary={pagenumber === 1} onClick={() => setpagenumber(1)}>{t('tabWarrantyExpired')}</WarrantyHeadBtn>
            <WarrantyHeadBtn $primary={pagenumber === 2} onClick={() => setpagenumber(2)}>{t('tabWarrantyAfterSale')}</WarrantyHeadBtn>
            <WarrantyHeadBtn $primary={pagenumber === 3} onClick={() => setpagenumber(3)}>{t('tabWarrantyAll')}</WarrantyHeadBtn>
          </div>
          {userLevel !== '2' && userLevel !== '3' && <div>
            <Addwarranty
              pagestate="add"
              fetchData={fetchData}
            />
          </div>}
        </WarrantyHead>
        <WarrantyBody>
          {
            !isLoading ?
              pagenumber === 1 ?
                <>
                  {
                    expiredArray.length > 0 ?
                      <DataTableComponent
                        warrantyData={expiredArray}
                      />
                      :
                      <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                  }
                </>
                :
                pagenumber === 2 ?
                  <>
                    {
                      onwarrantyArray.length > 0 ?
                        <DataTableComponent
                          warrantyData={onwarrantyArray}
                        />
                        :
                        <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    }
                  </>
                  :
                  <>
                    {
                      devicesArray.length > 0 ?
                        <DataTableComponent
                          warrantyData={devicesArray}
                        />
                        :
                        <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
                    }
                  </>
              :
              <Loading loading={true} title={t('loading')} icn={<RiLoader3Line />} />
          }
        </WarrantyBody>

        <Modal scrollable show={show} onHide={closemodal} size="lg">
          <Modal.Header>
            <ModalHead>
              <strong>
                Details
              </strong>
              <button onClick={closemodal}>
                <RiCloseLine />
              </button>
            </ModalHead>
          </Modal.Header>
          <Modal.Body>
            {
              deviceDetails.length > 0 ?
                <Printwarranty
                  data={deviceDetails}
                  componentRef={componentRef}
                />
                :
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
            }
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <ReactToPrint
                trigger={() =>
                  <FormBtn type="submit">
                    <RiPrinterLine />
                    {t('print')}
                  </FormBtn>}
                content={() => componentRef.current}
                pageStyle={`@page { size: portrait; margin: 5mm; padding: 0mm; }`}
              />
            </FormFlexBtn>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  )
}
