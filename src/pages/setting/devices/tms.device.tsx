import { useTranslation } from "react-i18next"
import { TmsAddDeviceHead, TmsManageDevicesContainer } from "../../../style/components/tms.adddevice.style"
import { DevHomeHead, ManageDeviceBody } from "../../../style/style"
import PageLoading from "../../../components/loading/page.loading"
import DataTable, { TableColumn } from "react-data-table-component"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../../stores/store"
import { useEffect, useState } from "react"
import { TmsDeviceType } from "../../../types/tms.type"
import FilterHosWardTemporary from "../../../components/dropdown/filter.hos.ward.temp"
import { setSearchQuery } from "../../../stores/utilsStateSlice"
import TmsAddDevice from "./tms.add.device"

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
          <TmsAddDevice
            pagestate="add"
            devdata={{} as TmsDeviceType}
          />
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