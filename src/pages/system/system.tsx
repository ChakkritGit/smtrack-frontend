import { Container } from "react-bootstrap"
import {
  H3mt, LineHeightSystem, ListMenu, ListPrivacy, SettingLeftContainer,
  SettingRightContainer, SettingSystemContainer,
  SubSideBottomContainer
} from "../../style/style"
import { useTranslation } from "react-i18next"
import { RiAlarmWarningLine, RiContactsBook2Line, RiFileTextLine, RiLogoutBoxRLine, RiPaletteLine, RiShieldCheckLine, RiTranslate2, RiUser6Line } from "react-icons/ri"
import { useState } from "react"
import Color from "./display"
import { useNavigate } from "react-router-dom"
import Account from "./account"
import { useDispatch, useSelector } from "react-redux"
import Lang from "./lang"
import Noti from "./noti"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { swalWithBootstrapButtons } from "../../constants/sweetalertLib"
import { cookieOptions, cookies } from "../../constants/constants"
import { setCookieEncode, setDeviceId, setSerial, setSwitchTms } from "../../stores/utilsStateSlice"
import { RootState, storeDispatchType } from "../../stores/store"
import Logs from "../setting/Logs"
import DownloadApp from "./download"
import { reset } from "../../stores/resetAction"

export default function System() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { expand, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
  const [pagenumber, setPagenumber] = useState(localStorage.getItem('settingTab') ?? '1')
  const navigate = useNavigate()

  const logOut = () => {
    dispatch(reset())
    dispatch(setCookieEncode(''))
    dispatch(setDeviceId(''))
    dispatch(setSerial(''))
    dispatch(setSwitchTms(false))
    cookies.remove('localDataObject', cookieOptions)
    cookies.remove('devSerial', cookieOptions)
    cookies.remove('devid', cookieOptions)
    cookies.remove('selectHos', cookieOptions)
    cookies.remove('selectWard', cookieOptions)
    cookies.remove('isTms', cookieOptions)
    cookies.update()
    navigate("/login")
  }

  return (
    <Container fluid className="h-100">
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <H3mt>{t('sideSetting')}</H3mt>
        <SettingSystemContainer>
          <SettingLeftContainer $primary={expand}>
            <div>
              <ListMenu $primary={pagenumber === '1'} onClick={() => { setPagenumber('1'); localStorage.setItem('settingTab', '1') }}>
                <RiUser6Line />
                <span>{t('tabAccount')}</span>
              </ListMenu>
              <ListMenu $primary={pagenumber === '2'} onClick={() => { setPagenumber('2'); localStorage.setItem('settingTab', '2') }}>
                <RiPaletteLine />
                <span>
                  {t('tabDisplay')}
                </span>
              </ListMenu>
              <ListMenu $primary={pagenumber === '3'} onClick={() => { setPagenumber('3'); localStorage.setItem('settingTab', '3') }}>
                <RiTranslate2 />
                <span>
                  {t('tabLanguage')}
                </span>
              </ListMenu>
              <ListMenu $primary={pagenumber === '4'} onClick={() => { setPagenumber('4'); localStorage.setItem('settingTab', '4') }}>
                <RiAlarmWarningLine />
                <span>
                  {t('titleNotification')}
                </span>
              </ListMenu>
              {role === 'SUPER' &&
                <ListMenu $primary={pagenumber === '5'} onClick={() => { setPagenumber('5'); localStorage.setItem('settingTab', '5') }}>
                  <RiFileTextLine />
                  <span>
                    {t('sysLogs')}
                  </span>
                </ListMenu>
              }
              {/* <ListMenu $primary={pagenumber === '6'} onClick={() => { setPagenumber('6'); localStorage.setItem('settingTab', '6') }}>
                <RiApps2AddLine />
                <span>
                  {t('appMenu')}
                </span>
              </ListMenu> */}
            </div>
            <SubSideBottomContainer>
              <ListPrivacy onClick={() => navigate('/support')}>
                <RiContactsBook2Line />
                <span>
                  {t('contactSupport')}
                </span>
              </ListPrivacy>
              <ListPrivacy onClick={() => navigate('/privacy-policy')}>
                <RiShieldCheckLine />
                <span>
                  {t('privacy')}
                </span>
              </ListPrivacy>
              <ListPrivacy onClick={() => navigate('/terms-conditions')}>
                <RiShieldCheckLine />
                <span>
                  {t('terms')}
                </span>
              </ListPrivacy>
              <ListMenu $logout onClick={() =>
                swalWithBootstrapButtons
                  .fire({
                    title: t('logoutDialog'),
                    text: t('logoutDialogText'),
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: t('confirmButton'),
                    cancelButtonText: t('cancelButton'),
                    reverseButtons: false,
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      logOut()
                    }
                  })
              }>
                <RiLogoutBoxRLine />
                <span>{t('tabLogout')}</span>
              </ListMenu>
            </SubSideBottomContainer>
          </SettingLeftContainer>
          <LineHeightSystem />
          <SettingRightContainer>
            {
              pagenumber === '1' ?
                <div>
                  <Account />
                </div>
                :
                pagenumber === '2' ?
                  <div>
                    <Color />
                  </div>
                  :
                  pagenumber === '3' ?
                    <Lang />
                    :
                    pagenumber === '4' ?
                      <Noti />
                      :
                      pagenumber === '5' ?
                        <Logs />
                        :
                        <DownloadApp />
            }
          </SettingRightContainer>
        </SettingSystemContainer>
      </motion.div>
    </Container>
  )
}
