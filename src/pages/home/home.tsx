import {
  RiArrowDownWideLine,
  RiArrowUpWideLine,
  RiDoorClosedLine,
  RiDoorOpenLine,
  RiErrorWarningLine,
  RiFileForbidLine,
  RiLayoutGridLine,
  RiListUnordered,
  RiSettings3Line,
  RiSkipUpLine,
  RiTempColdLine
} from 'react-icons/ri'
import {
  AboutBox,
  CardDevBtn,
  DatatableHome,
  DevHomeHeadTile,
  DevHomeSecctionOne,
  DeviceCardFooterDoor,
  DeviceCardFooterDoorFlex,
  DeviceCardFooterInfo,
  DeviceCardHeadHandle,
  DeviceInfoflex,
  DeviceListFlex,
  DeviceStateNetwork,
  HomeContainerFlex,
  ListBtn,
  SubWardColumnFlex
} from '../../style/style'
import { useTranslation } from 'react-i18next'
import { useCallback, useMemo, useState } from 'react'
import { useEffect } from 'react'
// import { devicesType } from "../../types/device.type"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDeviceId,
  setSerial,
  setSearchQuery,
  setShowAlert
} from '../../stores/utilsStateSlice'
import { RootState, storeDispatchType } from '../../stores/store'
import DataTable, { TableColumn } from 'react-data-table-component'
import {
  calulateDate,
  cookieOptions,
  cookies,
  paginationCardHome
} from '../../constants/constants'
import {
  FloatingTop,
  HomeContainer,
  TagCurrentHos
} from '../../style/components/home.styled'
import { DoorKey } from '../../types/log.type'
import FilterHosAndWard from '../../components/dropdown/filter.hos.ward'
import { WarrantySpan } from '../../style/components/warranty.styled'
import { NoRecordContainer } from '../../style/components/datatable.styled'
import { responseType } from '../../types/response.type'
import axiosInstance from '../../constants/axiosInstance'
import {
  DevicesType,
  HomeDeviceType,
  ProbeType
} from '../../types/smtrack/devices.type'
import { AxiosError } from 'axios'

export default function Home () {
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    searchQuery,
    hosId,
    wardId,
    userProfile,
    tokenDecode,
    transparent,
    socketData
  } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
  const hospitalsData = useSelector(
    (state: RootState) => state.arraySlice.hospital.hospitalsData
  )
  const wardData = useSelector(
    (state: RootState) => state.arraySlice.ward.wardData
  )
  const [listAndgrid, setListandgrid] = useState(
    Number(localStorage.getItem('listGrid') ?? 1)
  )
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [showSetting, setShowSetting] = useState(false)
  const [showSettingMute, setShowSettingMute] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expand, setExpand] = useState(false)

  const [totalRows, setTotalRows] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [devices, setDevices] = useState<HomeDeviceType[]>([])
  const [deviceFilter, setDeviceFilter] = useState<HomeDeviceType[]>([])
  // const [loading, setLoading] = useState({
  //   deviceLoading: false,
  //   countLoading: false
  // })

  useEffect(() => {
    setDeviceFilter(
      devices.filter(f => {
        return (
          f?.name
            ?.toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase()) ||
          f?.id.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
        )
      })
    )
  }, [searchQuery, devices])

  const fetchDevices = useCallback(
    async (page: number, size = perPage) => {
      try {
        // setLoading({ ...loading, deviceLoading: true })
        const response = await axiosInstance.get<responseType<DevicesType>>(
          `/devices/device?${
            wardId ? `ward=${wardId}&` : ''
          }page=${page}&perpage=${size}`
        )
        setDevices(response.data.data.devices)
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
      // finally {
      //   setLoading({ ...loading, deviceLoading: false })
      // }
    },
    [wardId, socketData]
  )

  const handlePageChange = (page: number) => {
    fetchDevices(page)
    setCurrentPage(page)
  }

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage)
    fetchDevices(page, newPerPage)
    cookies.set('rowperpage', page, cookieOptions)
  }

  useEffect(() => {
    fetchDevices(1)
  }, [wardId, socketData])

  const openSettingMute = () => {
    setShowSettingMute(true)
  }

  const openSetting = () => {
    setShowSetting(true)
  }

  const openmodal = (deviceData: HomeDeviceType) => {
    setDeviceData(deviceData)
    setShow(true)
  }

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const handleRowClicked = (row: HomeDeviceType) => {
    cookies.set('devid', row.id, cookieOptions)
    cookies.set('devSerial', row.id, cookieOptions)
    dispatch(setDeviceId(row.id))
    dispatch(setSerial(row.id))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const columns: TableColumn<HomeDeviceType>[] = [
    {
      name: t('deviceNameTb'),
      selector: items => items.name ?? 'Name is not assigned',
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceSerialTb'),
      cell: items => items.id,
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('deviceLocationTb'),
      cell: items => (
        <span title={items.location ?? '- -'}>{items.location ?? '- -'}</span>
      ),
      sortable: false,
      center: true,
      width: '200px'
    },
    {
      name: t('devicsmtrackTb'),
      cell: items => (
        <span key={items.id}>
          {items.log.length > 0
            ? `${items.log[0].tempDisplay.toFixed(2)}°C`
            : '- -'}
        </span>
      ),
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('deviceHumiTb'),
      selector: items =>
        items.log.length > 0
          ? `${items.log[0].humidityDisplay.toFixed(2)}%`
          : '- -',
      sortable: false,
      center: true,
      width: '85px'
    },
    {
      name: t('deviceProbeTb'),
      cell: items => {
        const [temp] = items.log.filter(log => log.serial === items.id)
        const [probe] = items.probe.filter(probe => probe.sn === items.id)
        const isTempOutOfRange =
          temp?.tempDisplay >= probe?.tempMax ||
          temp?.tempDisplay <= probe?.tempMin

        return (
          <DeviceCardFooterInfo $size $primary={isTempOutOfRange}>
            {isTempOutOfRange ? <RiErrorWarningLine /> : <RiTempColdLine />}
          </DeviceCardFooterInfo>
        )
        // ) : (
        //   <div>
        //     {`${items.noti.filter(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])).length} ${t('countNormalUnit')}`}
        //   </div>
        // );
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceDoorTb'),
      cell: items => {
        const doorCount: number = items.probe[0]?.doorQty || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return (
          <DeviceCardFooterDoorFlex key={items.id} $primary>
            {doors.slice(0, doorCount).map(doorKey => (
              <DeviceCardFooterDoor
                $primary={items.log[0]?.[doorKey]}
                key={doorKey}
              >
                {items.log[0]?.[doorKey] ? (
                  <RiDoorOpenLine />
                ) : (
                  <RiDoorClosedLine />
                )}
              </DeviceCardFooterDoor>
            ))}
          </DeviceCardFooterDoorFlex>
        )
        // : (
        //   <div>
        //     {`${items.noti.filter(n => n.notiDetail.startsWith('PROBE') && n.notiDetail.split('/')[2].startsWith('ON')).length} ${t('countNormalUnit')}`}
        //   </div>
        // );
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceConnectTb'),
      cell: items => (
        <DeviceStateNetwork $primary={items.online}>
          {items.online ? t('deviceOnline') : t('deviceOffline')}
        </DeviceStateNetwork>
        //  : (
        //   <div>{`${items._count?.noti} ${t('countNormalUnit')}`}</div>
        // )
      ),
      sortable: false,
      center: true,
      width: '90px'
    },
    {
      name: t('devicePlugTb'),
      cell: items => (
        <span>{items.log[0]?.plug ? t('stateNormal') : t('stateProblem')}</span>
        // : (
        //   <div>{`${items.noti.filter(n => n.notiDetail.split('/')[0] === 'AC').length} ${t('countNormalUnit')}`}</div>
        // )
      ),
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('deviceBatteryTb'),
      selector: items =>
        items.log[0]?.battery ? `${items.log[0].battery}%` : '- -',
      sortable: false,
      center: true,
      width: '83px'
    },
    {
      name: t('deviceWarrantyTb'),
      cell: items => {
        return (
          <WarrantySpan
            $expired={
              calulateDate(items).remainingDays <= 0 &&
              calulateDate(items).months <= 0 &&
              calulateDate(items).years <= 0
            }
          >
            {items.warranty[0]?.expire
              ? calulateDate(items).daysRemaining > 0
                ? calulateDate(items).years > 0
                  ? `${calulateDate(items).years} ${t('year')} ${
                      calulateDate(items).months
                    } ${t('month')} ${calulateDate(items).remainingDays} ${t(
                      'day'
                    )}`
                  : calulateDate(items).months > 0
                  ? `${calulateDate(items).months} ${t('month')} ${
                      calulateDate(items).remainingDays
                    } ${t('day')}`
                  : `${calulateDate(items).remainingDays} ${t('day')}`
                : t('tabWarrantyExpired')
              : t('notRegistered')}
          </WarrantySpan>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceActionTb'),
      cell: items => (
        <DeviceCardHeadHandle>
          <CardDevBtn onClick={() => openmodal(items)}>
            <RiSettings3Line />
          </CardDevBtn>
        </DeviceCardHeadHandle>
      ),
      sortable: false,
      center: true
    }
  ]

  const subDeviceColumns: TableColumn<ProbeType>[] = [
    {
      name: t('probeChannelSubTb'),
      cell: (items, index) => <span key={index}>{items.channel}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('probeNameSubTb'),
      cell: (items, index) => (
        <span key={index}>{items.name ?? 'Name is not assigned'}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('probeTypeSubTb'),
      cell: (items, index) => (
        <span key={index}>{items.type ?? 'Type is not assigned'}</span>
      ),
      sortable: false,
      center: true
    },
    {
      name: t('probsmtrackSubTb'),
      cell: (items, index) => {
        const deviceLog = devices
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        return (
          <span key={index}>
            {deviceLog?.tempDisplay
              ? `${deviceLog?.tempDisplay.toFixed(2)}°C`
              : '- -'}
          </span>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('probeHumiSubTb'),
      cell: (items, index) => {
        const deviceLog = devices
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        return (
          <span key={index}>
            {deviceLog?.humidityDisplay
              ? `${deviceLog?.humidityDisplay.toFixed(2)}%`
              : '- -'}
          </span>
        )
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceProbeTb'),
      cell: items => {
        const deviceLog = devices
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        const isTempOutOfRange =
          deviceLog!?.tempDisplay >= items.tempMax ||
          deviceLog!?.tempDisplay <= items.tempMin

        return (
          <DeviceCardFooterInfo $size $primary={isTempOutOfRange}>
            {isTempOutOfRange ? <RiErrorWarningLine /> : <RiTempColdLine />}
          </DeviceCardFooterInfo>
        )
      },
      sortable: false,
      center: true,
      width: '80px'
    },
    {
      name: t('probeDoorSubTb'),
      cell: items => {
        const deviceLog = devices
          .find(dev => dev.id === items.sn)
          ?.log.find(log => log.probe === items.channel)

        const renderDoor = (doorKey: 'door1' | 'door2' | 'door3') => (
          <DeviceCardFooterDoor $primary={deviceLog?.[doorKey]} key={doorKey}>
            {deviceLog?.[doorKey] ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          </DeviceCardFooterDoor>
        )

        return (
          <DeviceCardFooterDoorFlex $primary>
            {Array.from({ length: items.doorQty }, (_, i) =>
              renderDoor(`door${i + 1}` as 'door1')
            )}
          </DeviceCardFooterDoorFlex>
        )
      },
      sortable: false,
      center: true
    }
  ]

  const ExpandedComponent = ({ data }: { data: HomeDeviceType }) => {
    const { probe } = data
    return (
      <SubWardColumnFlex>
        <DataTable
          columns={subDeviceColumns}
          data={probe}
          noDataComponent={
            <NoRecordContainer>
              <RiFileForbidLine size={32} />
              <h4>{t('nodata')}</h4>
            </NoRecordContainer>
          }
          responsive
          dense
        />
      </SubWardColumnFlex>
    )
  }

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
        setExpand(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ContentComponent = useMemo(
    () => (
      <>
        {
          listAndgrid === 1 ? (
            <DatatableHome>
              <DataTable
                columns={columns}
                data={deviceFilter}
                // progressComponent={<Loading icn={<FiLoader size={42} />} loading title={t('loading')} />}
                // progressPending={loading.deviceLoading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationDefaultPage={currentPage}
                paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                onRowClicked={handleRowClicked}
                noDataComponent={
                  <NoRecordContainer>
                    <RiFileForbidLine size={32} />
                    <h4>{t('nodata')}</h4>
                  </NoRecordContainer>
                }
                responsive
                pointerOnHover
                fixedHeader
                fixedHeaderScrollHeight='calc(100dvh - 450px)'
                expandableRowsComponent={ExpandedComponent}
                highlightOnHover
                expandableRows
              />
            </DatatableHome>
          ) : (
            <></>
          )
          // <DevHomeDetails $primary={displayedCards.length === 0} $limitListFlex={displayedCards.length < 5 && displayedCards.length > 0}>
          //   <div>
          //     {displayedCards.length > 0 ? (
          //       displayedCards.map((item) => (
          //         <DevicesInfoCard
          //           key={item.devSerial}
          //           devicesdata={item}
          //           onFilter={onFilteres}
          //           setDeviceData={setDeviceData}
          //           setShow={setShow}
          //         />
          //       ))
          //     ) : (
          //       <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
          //     )}
          //   </div>
          //   <PaginitionContainer>
          //     <div></div>
          //     <Paginition
          //       currentPage={currentPage}
          //       cardsPerPage={cardsPerPage}
          //       changePage={changePage}
          //       displaySelectDevices={displaySelectDevices}
          //       displayedCards={displayedCards}
          //       userdata={displayedCards}
          //       pagPerpage={paginationCardHome}
          //       totalPages={totalPages}
          //     />
          //   </PaginitionContainer>
          // </DevHomeDetails>
        }
      </>
    ),
    [listAndgrid, columns, currentPage, paginationCardHome]
  )

  return (
    <HomeContainer>
      {/* {
        devices.length > 0 ? */}
      <HomeContainerFlex>
        <DevHomeHeadTile $primary={listAndgrid === 2}>
          <h5>{t('showAllBox')}</h5>
          {role === 'SUPER' && (
            <TagCurrentHos>
              {`${
                hospitalsData.filter(f => f.id?.includes(hosId))[0]?.hosName ??
                userProfile?.ward.hospital.hosName
              } - ${
                wardData?.filter(w => w.id?.includes(wardId))[0]?.wardName ??
                'ALL'
              }`}
            </TagCurrentHos>
          )}
        </DevHomeHeadTile>
        <DevHomeSecctionOne
          $primary={scrolled}
          $expand={expand}
          $inList={listAndgrid === 1}
          $transparent={transparent}
        >
          <div>
            {/* <HomeCard
                  deviceData={devices}
                  cardActive={cardActive}
                  setCardActive={setCardActive}
                  wardId={wardId}
                  setOnFilteres={setOnFilteres}
                /> */}
          </div>
          <div>
            {!expand ? (
              <RiArrowUpWideLine size={24} onClick={() => setExpand(true)} />
            ) : (
              <RiArrowDownWideLine size={24} onClick={() => setExpand(false)} />
            )}
          </div>
        </DevHomeSecctionOne>
        <AboutBox $primary={listAndgrid === 2}>
          <h5>{t('detailAllBox')}</h5>
          <DeviceInfoflex>
            <FilterHosAndWard />
            <DeviceListFlex>
              <ListBtn
                $primary={listAndgrid === 1}
                onClick={() => {
                  localStorage.setItem('listGrid', String(1))
                  setListandgrid(1)
                }}
              >
                <RiListUnordered />
              </ListBtn>
              <ListBtn
                $primary={listAndgrid === 2}
                onClick={() => {
                  localStorage.setItem('listGrid', String(2))
                  setListandgrid(2)
                }}
              >
                <RiLayoutGridLine />
              </ListBtn>
            </DeviceListFlex>
          </DeviceInfoflex>
        </AboutBox>
        {ContentComponent}
      </HomeContainerFlex>
      {/* :
          <PageLoading />
      } */}

      <FloatingTop $primary={visible} onClick={scrollToTop}>
        <RiSkipUpLine size={24} />
      </FloatingTop>

      {/* {
        show && deviceData && <ModalAdjust
          key={deviceData.devId}
          devicesdata={deviceData}
          fetchData={filtersDevices}
          setShow={setShow}
          show={show}
          openSetting={openSetting}
          openSettingMute={openSettingMute}
        />
      }
      {
        showSetting && deviceData && <ModalNotification
          key={deviceData.devId}
          devicesdata={deviceData}
          fetchData={filtersDevices}
          setShow={setShow}
          showSetting={showSetting}
          setShowSetting={setShowSetting}
        />
      }
      {
        showSettingMute && deviceData && <ModalMute
          key={deviceData.devId}
          devicesdata={deviceData}
          setShow={setShow}
          showSettingMute={showSettingMute}
          setShowSettingMute={setShowSettingMute}
        />
      } */}
    </HomeContainer>
  )
}
