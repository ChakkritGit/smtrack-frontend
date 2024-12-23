import { useTranslation } from "react-i18next"
import { TmsAddDeviceHead, TmsManageDevicesContainer } from "../../../style/components/tms.adddevice.style"
import { DevHomeHead, ManageDeviceBody, ManageDevSpanUnsetUserSelect } from "../../../style/style"
import PageLoading from "../../../components/loading/page.loading"
import DataTable, { TableColumn } from "react-data-table-component"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../../stores/store"
import { useCallback, useEffect, useState } from "react"
import { FetchDeviceType, TmsDeviceType } from "../../../types/tms.type"
import FilterHosWardTemporary from "../../../components/dropdown/filter.hos.ward.temp"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import TmsAddDevice from "./tms.add.device"
import { NoRecordContainer } from "../../../style/components/datatable.styled"
import { RiDeleteBin2Line, RiFileForbidLine } from "react-icons/ri"
import toast from "react-hot-toast"
import axiosInstance from "../../../constants/axiosInstance"
import { responseType } from "../../../types/response.type"
import { AxiosError } from "axios"
import Loading from "../../../components/loading/loading"
import { FiLoader } from "react-icons/fi"
import { Actiontableprobe, DelProbeButton } from "../../../style/components/manage.probe"
import { swalWithBootstrapButtons } from "../../../constants/sweetalertLib"
import Swal from "sweetalert2"

const TmsDevice = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { searchQuery, wardId } = useSelector((state: RootState) => state.utilsState)
  const [filterById, setFilterById] = useState({
    hosId: '',
    wardId: ''
  })
  const [devices, setDevices] = useState<TmsDeviceType[]>([])
  const [loading, setLoading] = useState({
    deviceLoading: false,
    countLoading: false
  })
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [deviceFilter, setDeviceFilter] = useState<TmsDeviceType[]>([])

  useEffect(() => {
    setDeviceFilter(devices.filter((f) => {
      return f?.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
        f?.sn.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    }))
  }, [searchQuery, devices])

  const fetchDevices = useCallback(async (page: number, size = perPage) => {
    try {
      setLoading({ ...loading, deviceLoading: true })
      const response = await axiosInstance.get<responseType<FetchDeviceType>>(`${import.meta.env.VITE_APP_API}/legacy/device?ward=${wardId}&page=${page}&perpage=${size}`)
      setDevices(response.data.data.devices)
      setTotalRows(response.data.data.total)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading({ ...loading, deviceLoading: false })
    }
  }, [perPage, wardId])

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDevices(page, newPerPage)
  }

  useEffect(() => {
    fetchDevices(1)
  }, [wardId])

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const deleteDevice = async (serial: string) => {
    try {
      const response = await axiosInstance.delete<responseType<FetchDeviceType>>(`${import.meta.env.VITE_APP_API}/legacy/device/${serial}`)
      fetchDevices(1)
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
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

  const columns: TableColumn<TmsDeviceType>[] = [
    {
      name: t('noNumber'),
      cell: (_, index) => {
        return <div>{index + 1}</div>
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceSerialTb'),
      cell: (item) => (
        <ManageDevSpanUnsetUserSelect
          key={item.sn}
          onClick={() => {
            try {
              navigator.clipboard.writeText(item.sn)
              toast.success(t('copyToClip'))
            } catch (error) {
              console.error('Failed to copy: ', error)
              toast.error(t('copyToClipFaile'))
            }
          }}>
          {item.sn}
        </ManageDevSpanUnsetUserSelect>
      ),
      sortable: false,
      center: true,
    },
    {
      name: t('deviceNameTb'),
      selector: (item) => item.name,
      sortable: false,
      center: true
    },
    {
      name: t('action'),
      cell: (item, index) => (
        <Actiontableprobe key={index}>
          <DelProbeButton onClick={() =>
            swalWithBootstrapButtons
              .fire({
                title: t('deleteProbe'),
                text: t('deleteProbeText'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: t('confirmButton'),
                cancelButtonText: t('cancelButton'),
                reverseButtons: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  deleteDevice(item.sn)
                }
              })}>
            <RiDeleteBin2Line size={16} />
          </DelProbeButton>
        </Actiontableprobe>
      ),
      sortable: false,
      center: true
    }
  ]

  return (
    <TmsManageDevicesContainer>
      <TmsAddDeviceHead>
        <h3>{t('titleManageDevices')}</h3>
        <DevHomeHead>
          <FilterHosWardTemporary
            filterById={filterById}
            setFilterById={setFilterById}
          />
          <TmsAddDevice
            fetchDevice={fetchDevices}
          />
        </DevHomeHead>
      </TmsAddDeviceHead>
      <ManageDeviceBody>
        {
          devices.length > 0 ?
            <DataTable
              columns={columns}
              data={deviceFilter}
              progressComponent={<Loading icn={<FiLoader size={42} />} loading title={t('loading')} />}
              progressPending={loading.deviceLoading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent={<NoRecordContainer>
                <RiFileForbidLine size={32} />
                <h4>{t('nodata')}</h4>
              </NoRecordContainer>}
              responsive
              pointerOnHover
              fixedHeader
              fixedHeaderScrollHeight="calc(100dvh - 230px)"
            />
            :
            <PageLoading />
        }
      </ManageDeviceBody>
    </TmsManageDevicesContainer>
  )
}

export default TmsDevice