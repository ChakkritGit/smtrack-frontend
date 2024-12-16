import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { HomeContainer, TagCurrentHos } from "../../style/components/home.styled"
import { AboutBox, DatatableHome, DevHomeHeadTile, DevHomeSecctionOne, DeviceInfoflex, DeviceListFlex, HomeContainerFlex, ListBtn } from "../../style/style"
import { useTranslation } from "react-i18next"
import { RiArrowDownWideLine, RiArrowUpWideLine, RiLayoutGridLine, RiListUnordered } from "react-icons/ri"
import { FiLoader } from "react-icons/fi"
import { useCallback, useEffect, useMemo, useState } from "react"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"
import TmsHomeCard from "../../components/home/tms.home.card"
import DataTable, { TableColumn } from "react-data-table-component"
import { FetchDeviceType, TmsCountType, TmsDeviceType } from "../../types/tms.type"
import axiosInstance from "../../constants/axiosInstance"
import { AxiosError } from "axios"
import { responseType } from "../../types/response.type"
import Loading from "../../components/loading/loading"

const TmsHome = () => {
  const { t } = useTranslation()
  const { hospital, ward } = useSelector((state: RootState) => state.arraySlice)
  const { userProfile, hosId, wardId, transparent, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
  const { hospitalsData } = hospital
  const { wardData } = ward
  const [listAndgrid, setListandgrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const [scrolled, setScrolled] = useState(false)
  const [expand, setExpand] = useState(false)

  const [devices, setDevices] = useState<TmsDeviceType[]>([])
  const [count, setCount] = useState<TmsCountType>()
  const [loading, setLoading] = useState({
    deviceLoading: false,
    countLoading: false
  })
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchDevices = useCallback(async (page: number, size = perPage) => {
    try {
      setLoading({ ...loading, deviceLoading: true })

      const response = await axiosInstance.get<responseType<FetchDeviceType>>(`http://192.168.0.74:8080/legacy/device?ward=test&page=${page}&perpage=${size}`)

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
  }, [perPage])

  const fetchCount = useCallback(async () => {
    try {
      setLoading({ ...loading, countLoading: true })

      const response = await axiosInstance.get<responseType<TmsCountType>>(`http://192.168.0.74:8080/legacy/templog/dashboard/count`)

      setCount(response.data.data)

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    } finally {
      setLoading({ ...loading, countLoading: false })
    }
  }, [])

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
    fetchCount()
  }, [])

  const columns: TableColumn<TmsDeviceType>[] = useMemo(
    () => [
      {
        name: t('deviceNameTb'),
        cell: (item) => item.name,
        sortable: false,
        center: true
      },
      {
        name: t('deviceSerialTb'),
        cell: (item) => item.sn,
        sortable: false,
        center: true
      },
      {
        name: t('deviceTempTb'),
        cell: (item) => item.log.length > 0 ? `${item.log[0]?.tempValue.toFixed(2)}°C` : '- -',
        sortable: false,
        center: true
      }
    ], [fetchDevices]
  )

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

  return (
    <HomeContainer>
      {
        // devices.length > 0 ?
        <HomeContainerFlex>
          <DevHomeHeadTile>
            <h5>
              {t('showAllBox')}
            </h5>
            {
              role === 'SUPER' && <TagCurrentHos>
                {`${hospitalsData.filter((f) => f.hosId?.includes(hosId))[0]?.hosName ?? userProfile?.ward.hospital.hosName} - ${wardData?.filter((w) => w.wardId?.includes(wardId))[0]?.wardName ?? 'ALL'}`}
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
              {
                !loading.countLoading ?
                  <TmsHomeCard
                    counts={count}
                  />
                  :
                  <Loading icn={<FiLoader size={42} />} loading title="Loading..." />
              }

            </div>
            <div>
              {
                !expand ? <RiArrowUpWideLine size={24} onClick={() => setExpand(true)} /> :
                  <RiArrowDownWideLine size={24} onClick={() => setExpand(false)} />
              }
            </div>
          </DevHomeSecctionOne>
          <AboutBox>
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
          <div>
            {
              listAndgrid === 1 ?
                <DatatableHome>
                  <DataTable
                    columns={columns}
                    data={devices}
                    progressComponent={<Loading icn={<FiLoader size={42} />} loading title="Loading..." />}
                    progressPending={loading.deviceLoading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    paginationDefaultPage={currentPage}
                    paginationRowsPerPageOptions={[10, 20, 50, 100, 150, 200]}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight="calc(100dvh - 450px)"
                  />
                </DatatableHome>
                :
                <div>Card</div>
            }
          </div>
        </HomeContainerFlex>
        // :
        // <PageLoading />
      }
    </HomeContainer>
  )
}

export default TmsHome