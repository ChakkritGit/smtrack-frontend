import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { HomeContainer, TagCurrentHos } from "../../style/components/home.styled"
import PageLoading from "../../components/loading/page.loading"
import { AboutBox, DevHomeHeadTile, DevHomeSecctionOne, DeviceInfoflex, DeviceListFlex, HomeContainerFlex, ListBtn } from "../../style/style"
import { useTranslation } from "react-i18next"
import { RiArrowDownWideLine, RiArrowUpWideLine, RiLayoutGridLine, RiListUnordered } from "react-icons/ri"
import { useEffect, useState } from "react"
import FilterHosAndWard from "../../components/dropdown/filter.hos.ward"
import TmsHomeCard from "../../components/home/tms.home.card"

const TmsHome = () => {
  const { t } = useTranslation()
  const { devices } = useSelector((state: RootState) => state.tmsDevice)
  const { hospital, ward } = useSelector((state: RootState) => state.arraySlice)
  const { cookieDecode, hosId, wardId, transparent } = useSelector((state: RootState) => state.utilsState)
  const { userLevel, hosName } = cookieDecode
  const { hospitalsData } = hospital
  const { wardData } = ward
  const [onFilteres, setOnFilteres] = useState(false)
  const [cardActive, setCardActive] = useState('')
  const [listAndgrid, setListandgrid] = useState(Number(localStorage.getItem('listGrid') ?? 1))
  const [scrolled, setScrolled] = useState(false)
  const [expand, setExpand] = useState(false)

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
        devices.length > 0 ?
          <HomeContainerFlex>
            <DevHomeHeadTile>
              <h5>
                {t('showAllBox')}
              </h5>
              {
                userLevel === '0' && <TagCurrentHos>
                  {`${hospitalsData.filter((f) => f.hosId?.includes(hosId))[0]?.hosName ?? hosName} - ${wardData?.filter((w) => w.wardId?.includes(wardId))[0]?.wardName ?? 'ALL'}`}
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
                <TmsHomeCard
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
          </HomeContainerFlex>
          :
          <PageLoading />
      }
    </HomeContainer>
  )
}

export default TmsHome