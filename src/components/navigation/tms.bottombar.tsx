import { useTranslation } from "react-i18next"
import { ActiveNavBlur, NavigationBottom, NavigationItems } from "../../style/components/bottom.navigate"
import { RiDashboardFill, RiDashboardLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { NavProfile } from "../../style/style"
import { ImageComponent } from "../../constants/constants"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import DefualtUserPic from "../../assets/images/default-user.jpg"

interface BottombarProps {
  isScrollingDown: boolean
}

const SecondBottombar = ({ isScrollingDown }: BottombarProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userProfile, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode

  return (
    <NavigationBottom $primary={isScrollingDown}>
      <NavigationItems $primary={location.pathname === "/"} onClick={() => navigate('/')}>
        {
          location.pathname === "/" ?
            <RiHome3Fill />
            :
            <RiHome3Line />
        }
        <span>{t('sideShowAllBox')}</span>
        <ActiveNavBlur $primary={location.pathname === "/"} />
      </NavigationItems>
      <NavigationItems $primary={location.pathname === "/dashboard" || location.pathname === "/dashboard/chart" || location.pathname === "/dashboard/table" || location.pathname === "/dashboard/chart/compare"} onClick={() => navigate('/dashboard')}>
        {
          location.pathname === "/dashboard" || location.pathname === "/dashboard/chart" || location.pathname === "/dashboard/table" || location.pathname === "/dashboard/chart/compare" ?
            <RiDashboardFill />
            :
            <RiDashboardLine />
        }
        <span>{t('sideDashboard')}</span>
        <ActiveNavBlur $primary={location.pathname === "/dashboard" || location.pathname.split('/')[2] === "chart" || location.pathname.split('/')[2] === "table" || location.pathname === "/dashboard/chart/compare"} />
      </NavigationItems>
      {
        role === "SUPER" &&
        <NavigationItems $primary={location.pathname === "/management" || location.pathname === '/management/flasher'} onClick={() => navigate('/management')}>
          {
            location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher' ?
              <RiListSettingsFill />
              :
              <RiListSettingsLine />
          }
          <span>{t('sideManage')}</span>
          <ActiveNavBlur $primary={location.pathname === "/management" || location.pathname === "/management/logadjust" || location.pathname === '/management/flasher'} />
        </NavigationItems>
      }
      <NavigationItems $primary={location.pathname === "/settings"} onClick={() => navigate('/settings')}>
        <NavProfile>
          <ImageComponent src={userProfile?.pic ? userProfile.pic : DefualtUserPic} alt="profile" ></ImageComponent>
        </NavProfile>
        <span>{t('tabAccount')}</span>
        <ActiveNavBlur $primary={location.pathname === "/settings"} />
      </NavigationItems>
    </NavigationBottom>
  )
}

export default SecondBottombar