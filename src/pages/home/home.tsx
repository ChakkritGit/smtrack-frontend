import {
  RiArrowDownWideLine,
  RiArrowUpWideLine,
  RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine,
  RiFileCloseLine,
  RiFileForbidLine,
  RiLayoutGridLine, RiListUnordered, RiSettings3Line, RiSkipUpLine, RiTempColdLine
} from "react-icons/ri"
import {
  AboutBox, CardDevBtn, DatatableHome, DevHomeDetails, DevHomeHeadTile,
  DevHomeSecctionOne, DeviceCardFooterDoor, DeviceCardFooterDoorFlex,
  DeviceCardFooterInfo, DeviceCardHeadHandle, DeviceInfoflex,
  DeviceListFlex, DeviceStateNetwork, HomeContainerFlex, ListBtn,
  PaginitionContainer,
  SubWardColumnFlex
} from "../../style/style"
import DevicesInfoCard from "../../components/home/devicesInfoCard"
import { useTranslation } from "react-i18next"
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react"
import { useEffect } from "react"
import { devicesType } from "../../types/device.type"
import Loading from "../../components/loading/loading"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setDeviceId, setSerial, setSearchQuery } from "../../stores/utilsStateSlice"
import { filtersDevices, setFilterDevice } from "../../stores/dataArraySlices"
import { RootState, storeDispatchType } from "../../stores/store"
import DataTable, { TableColumn } from "react-data-table-component"
import PageLoading from "../../components/loading/page.loading"
import { probeType } from "../../types/probe.type"
import { calulateDate, cookieOptions, cookies, paginationCardHome } from "../../constants/constants"
import { FloatingTop, HomeContainer, TagCurrentHos } from "../../style/components/home.styled"
import HomeCard from "../../components/home/home.card"
import Paginition from "../../components/filter/paginition"
import { DoorKey } from "../../types/log.type"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"
import ModalAdjust from "../../components/home/modal.adjust"
import ModalNotification from "../../components/home/modal.noti"
import ModalMute from "../../components/home/modal.mute"
import { WarrantySpan } from "../../style/components/warranty.styled"
import { NoRecordContainer } from "../../style/components/datatable.styled"

export default function Home() {
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector((state: RootState) => state.devices)
  const { searchQuery, hosId, wardId, userProfile, tokenDecode, transparent } = useSelector((state: RootState) => state.utilsState)
  const devicesFilter = useSelector((state: RootState) => state.arraySlice.device.devicesFilter)
  const hospitalsData = useSelector((state: RootState) => state.arraySlice.hospital.hospitalsData)
  const wardData = useSelector((state: RootState) => state.arraySlice.ward.wardData)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { role } = tokenDecode
  const [listAndgrid, setListandgrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const [onFilteres, setOnFilteres] = useState(false)
  const [rowPerPage, setRowPerPage] = useState(cookies.get('rowperpage') ?? 12)
  const [cardActive, setCardActive] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(cookies.get('rowperpage') ?? 12)
  const [displayedCards, setDisplayedCards] = useState<devicesType[]>(devicesFilter ? devicesFilter.slice(0, cardsPerPage) : [])
  const totalPages = Math.ceil(devicesFilter.length / cardsPerPage)
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const [deviceData, setDeviceData] = useState<devicesType | null>(null)
  const [showSetting, setShowSetting] = useState(false)
  const [showSettingMute, setShowSettingMute] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expand, setExpand] = useState(false)
  const [isFiltering, setIsFiltering] = useState(true)
  const filteredRef = useRef<devicesType[]>([])

  const openSettingMute = () => {
    setShowSettingMute(true)
  }

  const openSetting = () => {
    setShowSetting(true)
  }

  const openmodal = (deviceData: devicesType) => {
    setDeviceData(deviceData)
    setShow(true)
  }

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const handleRowClicked = (row: devicesType) => {
    cookies.set('devid', row.devId, cookieOptions)
    cookies.set('devSerial', row.devSerial, cookieOptions)
    dispatch(setDeviceId(row.devId))
    dispatch(setSerial(row.devSerial))
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }

  const filterDevices = useCallback(() => {
    setIsFiltering(true)

    const baseFilteredDevices = wardId
      ? devices.filter((item) => item.wardId.includes(wardId))
      : hosId
        ? devices.filter((item) => item.ward.hospital.hosId.includes(hosId))
        : devices

    const result = baseFilteredDevices.filter((item) =>
      item.devSerial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.devDetail?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    switch (cardActive) {
      case '1':
        filteredRef.current = result.filter(dev => dev.noti.some(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])))
        break;
      case '2':
        filteredRef.current = result.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0].startsWith('PROBE')))
        break;
      case '3':
        filteredRef.current = result.filter(dev => dev._count?.noti)
        break;
      case '4':
        filteredRef.current = result.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0] === 'AC'))
        break;
      case '5':
        filteredRef.current = result.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0] === 'SD'))
        break;
      case '6':
        navigate("/management/logadjust")
        return;
      case '7':
        navigate("/repair")
        return;
      case '8':
        navigate("/warranty")
        return;
      default:
        filteredRef.current = result
        break;
    }

    dispatch(setFilterDevice(filteredRef.current))
    setIsFiltering(false)
  }, [searchQuery, wardId, hosId, devices, cardActive])

  useEffect(() => {
    dispatch(setSearchQuery(''))
  }, [cardActive])

  useEffect(() => {
    filterDevices()
  }, [filterDevices])

  const columns: TableColumn<devicesType>[] = [
    {
      name: t('deviceNameTb'),
      selector: items => items.devDetail || 'Name is not assigned',
      sortable: false,
      center: true,
      width: '200px',
    },
    {
      name: t('deviceSerialTb'),
      cell: items => items.devSerial,
      sortable: false,
      center: true,
      width: '200px',
    },
    {
      name: t('deviceLocationTb'),
      cell: items => <span title={items.locInstall || '- -'}>{items.locInstall || '- -'}</span>,
      sortable: false,
      center: true,
      width: '200px',
    },
    {
      name: t('devicsmtrackTb'),
      cell: items => (
        <span key={items.devSerial}>
          {items.log[0]?.tempAvg ? `${items.log[0].tempAvg.toFixed(2)}°C` : '- -'}
        </span>
      ),
      sortable: false,
      center: true,
      width: '90px',
    },
    {
      name: t('deviceHumiTb'),
      selector: items =>
        items.log[0]?.humidityAvg ? `${items.log[0].humidityAvg.toFixed(2)}%` : '- -',
      sortable: false,
      center: true,
      width: '85px',
    },
    {
      name: t('deviceProbeTb'),
      cell: items => {
        const [temp] = items.log.filter(log => log.devSerial === items.devSerial)
        const [probe] = items.probe.filter(probe => probe.devSerial === items.devSerial)
        const isTempOutOfRange = temp?.tempAvg >= probe?.tempMax || temp?.tempAvg <= probe?.tempMin

        return !onFilteres ? (
          <DeviceCardFooterInfo $size $primary={isTempOutOfRange}>
            {isTempOutOfRange ? <RiErrorWarningLine /> : <RiTempColdLine />}
          </DeviceCardFooterInfo>
        ) : (
          <div>
            {`${items.noti.filter(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1])).length} ${t('countNormalUnit')}`}
          </div>
        );
      },
      sortable: false,
      center: true,
      width: '80px',
    },
    {
      name: t('deviceDoorTb'),
      cell: items => {
        const doorCount: number = items.probe[0]?.door || 1
        const doors: DoorKey[] = ['door1', 'door2', 'door3']

        return !onFilteres ? (
          <DeviceCardFooterDoorFlex key={items.devId} $primary>
            {doors.slice(0, doorCount).map(doorKey => (
              <DeviceCardFooterDoor $primary={items.log[0]?.[doorKey] === "1"} key={doorKey}>
                {items.log[0]?.[doorKey] === "1" ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
              </DeviceCardFooterDoor>
            ))}
          </DeviceCardFooterDoorFlex>
        ) : (
          <div>
            {`${items.noti.filter(n => n.notiDetail.startsWith('PROBE') && n.notiDetail.split('/')[2].startsWith('ON')).length} ${t('countNormalUnit')}`}
          </div>
        );
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceConnectTb'),
      cell: items => (
        !onFilteres ? (
          <DeviceStateNetwork $primary={items.backupStatus === '0'}>
            {items.backupStatus === '0' ? t('deviceOffline') : t('deviceOnline')}
          </DeviceStateNetwork>
        ) : (
          <div>{`${items._count?.noti} ${t('countNormalUnit')}`}</div>
        )
      ),
      sortable: false,
      center: true,
      width: '90px',
    },
    {
      name: t('devicePlugTb'),
      cell: items => (
        !onFilteres ? (
          <span>{items.log[0]?.ac === '1' ? t('stateProblem') : t('stateNormal')}</span>
        ) : (
          <div>{`${items.noti.filter(n => n.notiDetail.split('/')[0] === 'AC').length} ${t('countNormalUnit')}`}</div>
        )
      ),
      sortable: false,
      center: true,
      width: '80px',
    },
    {
      name: t('deviceBatteryTb'),
      selector: items => items.log[0]?.battery ? `${items.log[0].battery}%` : '- -',
      sortable: false,
      center: true,
      width: '83px',
    },
    {
      name: t('deviceWarrantyTb'),
      cell: items => {

        return <WarrantySpan $expired={calulateDate(items).remainingDays <= 0 && calulateDate(items).months <= 0 && calulateDate(items).years <= 0}>
          {items.warranty[0]?.expire ?
            calulateDate(items).daysRemaining > 0
              ? calulateDate(items).years > 0
                ? `${calulateDate(items).years} ${t('year')} ${calulateDate(items).months} ${t('month')} ${calulateDate(items).remainingDays} ${t('day')}`
                : calulateDate(items).months > 0
                  ? `${calulateDate(items).months} ${t('month')} ${calulateDate(items).remainingDays} ${t('day')}`
                  : `${calulateDate(items).remainingDays} ${t('day')}`
              : t('tabWarrantyExpired')
            : t('notRegistered')}
        </WarrantySpan>
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceActionTb'),
      cell: items => (
        <DeviceCardHeadHandle>
          <CardDevBtn
            onClick={() => openmodal(items)}>
            <RiSettings3Line />
          </CardDevBtn>
        </DeviceCardHeadHandle>
      ),
      sortable: false,
      center: true,
    },
  ]

  const subDeviceColumns: TableColumn<probeType>[] = [
    {
      name: t('probeChannelSubTb'),
      cell: (items, index) => <span key={index}>{items.probeCh}</span>,
      sortable: false,
      center: true,
    },
    {
      name: t('probeNameSubTb'),
      cell: (items, index) => (
        <span key={index}>{items.probeName || 'Name is not assigned'}</span>
      ),
      sortable: false,
      center: true,
    },
    {
      name: t('probeTypeSubTb'),
      cell: (items, index) => (
        <span key={index}>{items.probeType || 'Type is not assigned'}</span>
      ),
      sortable: false,
      center: true,
    },
    {
      name: t('probsmtrackSubTb'),
      cell: (items, index) => {
        const deviceLog = devicesFilter
          .find(dev => dev.devSerial === items.devSerial)
          ?.log.find(log => log.probe === items.probeCh)

        return (
          <span key={index}>
            {deviceLog?.tempAvg ? `${deviceLog?.tempAvg.toFixed(2)}°C` : '- -'}
          </span>
        );
      },
      sortable: false,
      center: true,
    },
    {
      name: t('probeHumiSubTb'),
      cell: (items, index) => {
        const deviceLog = devicesFilter
          .find(dev => dev.devSerial === items.devSerial)
          ?.log.find(log => log.probe === items.probeCh)

        return (
          <span key={index}>
            {deviceLog?.humidityAvg ? `${deviceLog?.humidityAvg.toFixed(2)}%` : '- -'}
          </span>
        );
      },
      sortable: false,
      center: true,
    },
    {
      name: t('deviceProbeTb'),
      cell: items => {
        const deviceLog = devicesFilter
          .find(dev => dev.devSerial === items.devSerial)
          ?.log.find(log => log.probe === items.probeCh)

        const isTempOutOfRange =
          deviceLog!?.tempAvg >= items.tempMax || deviceLog!?.tempAvg <= items.tempMin

        return (
          <DeviceCardFooterInfo $size $primary={isTempOutOfRange}>
            {isTempOutOfRange ? <RiErrorWarningLine /> : <RiTempColdLine />}
          </DeviceCardFooterInfo>
        );
      },
      sortable: false,
      center: true,
      width: '80px',
    },
    {
      name: t('probeDoorSubTb'),
      cell: items => {
        const deviceLog = devicesFilter
          .find(dev => dev.devSerial === items.devSerial)
          ?.log.find(log => log.probe === items.probeCh)

        const renderDoor = (doorKey: 'door1' | 'door2' | 'door3') => (
          <DeviceCardFooterDoor $primary={deviceLog?.[doorKey] === '1'} key={doorKey}>
            {deviceLog?.[doorKey] === '1' ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          </DeviceCardFooterDoor>
        )

        return (
          <DeviceCardFooterDoorFlex $primary>
            {Array.from({ length: items.door }, (_, i) => renderDoor(`door${i + 1}` as 'door1'))}
          </DeviceCardFooterDoorFlex>
        );
      },
      sortable: false,
      center: true,
    },
  ]

  const ExpandedComponent = ({ data }: { data: devicesType }) => {
    const { probe } = data
    return (
      <SubWardColumnFlex>
        <DataTable
          columns={subDeviceColumns}
          data={probe}
          noDataComponent={<NoRecordContainer>
            <RiFileForbidLine size={32} />
            <h4>{t('nodata')}</h4>
          </NoRecordContainer>}
          responsive
          dense
        />
      </SubWardColumnFlex>
    )
  }

  useEffect(() => {
    setDisplayedCards(filteredRef.current ? filteredRef.current.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, filteredRef.current, cardsPerPage, rowPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, devicesFilter, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = devicesFilter ? (query ? devicesFilter.filter(card => [card?.devDetail, card?.locInstall, card?.devSerial].some(attr => attr?.toLowerCase().includes(query.toLowerCase()))) : devicesFilter) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    const newPage = currentPage + change
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
    }
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
    setRowPerPage(Number(event.target.value))
    cookies.set('rowperpage', Number(event.target.value), cookieOptions)
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

  const ContentComponent = useMemo(() => (
    <>
      {!isFiltering && (
        listAndgrid === 1 ? (
          <DatatableHome>
            <DataTable
              responsive={true}
              columns={columns}
              data={filteredRef.current}
              paginationRowsPerPageOptions={[12, 20, 40, 60, 80, 100]}
              paginationPerPage={rowPerPage}
              onRowClicked={handleRowClicked}
              expandableRowsComponent={ExpandedComponent}
              onChangeRowsPerPage={(n) => {
                setRowPerPage(n);
                cookies.set('rowperpage', n, cookieOptions);
              }}
              noDataComponent={<NoRecordContainer>
                <RiFileForbidLine size={32} />
                <h4>{t('nodata')}</h4>
              </NoRecordContainer>}
              highlightOnHover
              pagination
              expandableRows
              pointerOnHover
              fixedHeader
              fixedHeaderScrollHeight="calc(100dvh - 450px)"
            />
          </DatatableHome>
        ) : (
          <DevHomeDetails $primary={displayedCards.length === 0} $limitListFlex={displayedCards.length < 5 && displayedCards.length > 0}>
            <div>
              {displayedCards.length > 0 ? (
                displayedCards.map((item) => (
                  <DevicesInfoCard
                    key={item.devSerial}
                    devicesdata={item}
                    onFilter={onFilteres}
                    setDeviceData={setDeviceData}
                    setShow={setShow}
                  />
                ))
              ) : (
                <Loading loading={false} title={t('nodata')} icn={<RiFileCloseLine />} />
              )}
            </div>
            <PaginitionContainer>
              <div></div>
              <Paginition
                currentPage={currentPage}
                cardsPerPage={cardsPerPage}
                changePage={changePage}
                displaySelectDevices={displaySelectDevices}
                displayedCards={displayedCards}
                userdata={displayedCards}
                pagPerpage={paginationCardHome}
                totalPages={totalPages}
              />
            </PaginitionContainer>
          </DevHomeDetails>
        )
      )}
    </>
  ), [isFiltering, listAndgrid, columns, filteredRef.current, rowPerPage, displayedCards, currentPage, cardsPerPage, changePage, displaySelectDevices, paginationCardHome, totalPages])

  return (
    <HomeContainer>
      {
        devices.length > 0 ?
          <HomeContainerFlex>
            <DevHomeHeadTile $primary={listAndgrid === 2}>
              <h5>
                {t('showAllBox')}
              </h5>
              {
                role === 'SUPER' && <TagCurrentHos>
                  {
                    `${hospitalsData.filter((f) => f.hosId?.includes(hosId))[0]?.hosName ?? userProfile?.ward.hospital.hosName} - ${wardData?.filter((w) => w.wardId?.includes(wardId))[0]?.wardName ?? 'ALL'}`
                  }
                </TagCurrentHos>
              }
            </DevHomeHeadTile>
            <DevHomeSecctionOne
              $primary={scrolled}
              $expand={expand}
              $inList={listAndgrid === 1}
              $transparent={transparent}
            >
              <div>
                <HomeCard
                  deviceData={devices}
                  cardActive={cardActive}
                  setCardActive={setCardActive}
                  wardId={wardId}
                  setOnFilteres={setOnFilteres}
                />
              </div>
              <div>
                {
                  !expand ? <RiArrowUpWideLine size={24} onClick={() => setExpand(true)} /> :
                    <RiArrowDownWideLine size={24} onClick={() => setExpand(false)} />
                }
              </div>
            </DevHomeSecctionOne>
            <AboutBox $primary={listAndgrid === 2}>
              <h5>{t('detailAllBox')}</h5>
              <DeviceInfoflex>
                <FilterHosAndWard />
                <DeviceListFlex>
                  <ListBtn $primary={listAndgrid === 1} onClick={() => {
                    localStorage.setItem('listGrid', String(1))
                    setListandgrid(1)
                  }}>
                    <RiListUnordered />
                  </ListBtn>
                  <ListBtn $primary={listAndgrid === 2} onClick={() => {
                    localStorage.setItem('listGrid', String(2))
                    setListandgrid(2)
                  }}>
                    <RiLayoutGridLine />
                  </ListBtn>
                </DeviceListFlex>
              </DeviceInfoflex>
            </AboutBox>
            <>
              {ContentComponent}
            </>
          </HomeContainerFlex>
          :
          <PageLoading />
      }

      <FloatingTop $primary={visible} onClick={scrollToTop}>
        <RiSkipUpLine size={24} />
      </FloatingTop>

      {
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
      }
    </HomeContainer>
  )
}