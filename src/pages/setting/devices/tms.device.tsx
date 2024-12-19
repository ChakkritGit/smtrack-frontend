import { useTranslation } from "react-i18next"
import { TmsAddDeviceHead, TmsManageDevicesContainer } from "../../../style/components/tms.adddevice.style"
import { DevHomeHead, ManageDeviceBody, ManageDevSpanUnsetUserSelect } from "../../../style/style"
import PageLoading from "../../../components/loading/page.loading"
import DataTable, { TableColumn } from "react-data-table-component"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../../stores/store"
import { useEffect, useState } from "react"
import { TmsDeviceType } from "../../../types/tms.type"
import FilterHosWardTemporary from "../../../components/dropdown/filter.hos.ward.temp"
import { setSearchQuery } from "../../../stores/utilsStateSlice"
import TmsAddDevice from "./tms.add.device"
import { NoRecordContainer } from "../../../style/components/datatable.styled"
import { RiFileForbidLine } from "react-icons/ri"
import toast from "react-hot-toast"

const TmsDevice = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector((state: RootState) => state.tmsDevice)
  // const { searchQuery, cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const [filterById, setFilterById] = useState({
    hosId: '',
    wardId: ''
  })
  // const { hosId, wardId } = filterById
  // const { token, userLevel } = cookieDecode

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

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
    }
  ]

  // Filter Data
  // let filteredItems = useMemo(() => {
  //   return wardId !== ''
  //     ? devices.filter((item) => item.wardId.includes(wardId))
  //     : hosId && hosId !== ''
  //       ? devices.filter((item) => item.ward.hospital.hosId.includes(hosId))
  //       : devices
  // }, [wardId, devices, hosId])

  // const filter = filteredItems.filter((f) => f.devSerial && f.devSerial.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <TmsManageDevicesContainer>
      <TmsAddDeviceHead>
        <h3>{t('titleManageDevices')}</h3>
        <DevHomeHead>
          <FilterHosWardTemporary
            filterById={filterById}
            setFilterById={setFilterById}
          />
          <TmsAddDevice />
        </DevHomeHead>
      </TmsAddDeviceHead>
      <ManageDeviceBody>
        {
          devices.length > 0 ?
            <DataTable
              responsive={true}
              columns={columns}
              data={devices}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
              noDataComponent={<NoRecordContainer>
                <RiFileForbidLine size={32} />
                <h4>{t('nodata')}</h4>
              </NoRecordContainer>}
              pagination
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