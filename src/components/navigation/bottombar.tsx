import { RiDashboardFill, RiDashboardLine, RiHome3Fill, RiHome3Line, RiListSettingsFill, RiListSettingsLine, RiUser6Fill, RiUser6Line } from "react-icons/ri"
import { ActiveNavBlur, NavigationBottom, NavigationItems } from "../../style/components/bottom.navigate"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavProfile } from "../../style/style"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { ImageComponent } from "../../constants/constants"
import DefualtUserPic from "../../assets/images/default-user.jpg"

interface BottombarProps {
  isScrollingDown: boolean
}

export default function Bottombar({ isScrollingDown }: BottombarProps) {
  const { t } = useTranslation()
  const location = useLocation()
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
        role !== 'USER' ?
          <>
            <NavigationItems $primary={location.pathname === "/permission"} onClick={() => navigate('/permission')}>
              {
                location.pathname === "/permission" ?
                  <RiUser6Fill />
                  :
                  <RiUser6Line />
              }
              <span>{t('sidePermission')}</span>
              <ActiveNavBlur $primary={location.pathname === "/permission"} />
            </NavigationItems>
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
          </>
          :
          <></>
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
