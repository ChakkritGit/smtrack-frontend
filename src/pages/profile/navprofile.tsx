import { RiArrowDropDownLine, RiLogoutBoxRLine } from "react-icons/ri"
import { LineHr, NavLogout, NavProfile, NavProfileContainer, NavProfileFlex } from "../../style/style"
import { Dropdown } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { NavbarProfileDropdown } from "../../style/components/navbar"
import { cookieOptions, cookies, getRoleLabel, ImageComponent } from "../../constants/constants"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import { swalWithBootstrapButtons } from "../../components/dropdown/sweetalertLib"
import { reset } from "../../stores/resetAction"
import { setCookieEncode, setDeviceId, setSerial } from "../../stores/utilsStateSlice"
import DefualtUserPic from "../../assets/images/default-user.jpg"

export default function Navprofile() {
  const navigate = useNavigate()
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const { userProfile, tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const {role} = tokenDecode

  const logOut = () => {
    dispatch(reset())
    dispatch(setCookieEncode(''))
    dispatch(setDeviceId(''))
    dispatch(setSerial(''))
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
    <Dropdown>
      <Dropdown.Toggle variant="0" className="border-0 p-0">
        <NavProfileFlex>
          <NavProfileContainer className="profile-name-dark">
            <NavProfile>
              <ImageComponent src={userProfile?.pic ? `${userProfile.pic}` : DefualtUserPic} alt="profile" />
            </NavProfile>
            <div>
              <span>{userProfile?.display}</span>
              <span>{getRoleLabel(role, t)}</span>
            </div>
            <RiArrowDropDownLine size={28} />
          </NavProfileContainer>
        </NavProfileFlex>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <NavbarProfileDropdown>
          <NavProfileContainer onClick={() => navigate("/settings")}>
            <NavProfile>
              <ImageComponent src={userProfile?.pic ? `${userProfile.pic}` : DefualtUserPic} alt="profile" />
            </NavProfile>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100px', maxWidth: '100px' }}>
              <span style={{ display: 'block', width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{userProfile?.display}</span>
              <strong style={{ width: '100px', maxWidth: '100px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{getRoleLabel(role, t)}</strong>
            </div>
          </NavProfileContainer>
          <LineHr />
          <NavLogout onClick={() => swalWithBootstrapButtons
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
            })}>
            <RiLogoutBoxRLine />
            {t('tabLogout')}
          </NavLogout>
        </NavbarProfileDropdown>
      </Dropdown.Menu>
    </Dropdown>
  )
}
