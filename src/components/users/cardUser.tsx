import { cardType } from "../../types/component.type"
import { DelUserButton, UserDetails, UserMenu, UsercardFlex, Userimage } from "../../style/style"
import { RiDeleteBin2Line } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import Adduser from "../../pages/users/adduser"
import { swalWithBootstrapButtons } from "../../constants/sweetalertLib"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { RootState, storeDispatchType } from "../../stores/store"
import { fetchUserData } from "../../stores/userSlice"
import { responseType } from "../../types/response.type"
import { usersType } from "../../types/user.type"
import { setShowAlert } from "../../stores/utilsStateSlice"
import { getRoleLabel, ImageComponent } from "../../constants/constants"

export default function CardUser(userProp: cardType) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { displayName, userId, role, userName, userPic } = userProp

  const deleteUser = async (uID: string) => {
    const url: string = `${import.meta.env.VITE_APP_API}/user/${uID}`
    try {
      const response = await axios
        .delete<responseType<usersType>>(url, {
          headers: { authorization: `Bearer ${token}` }
        })
      dispatch(fetchUserData(token))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  return (
    <UsercardFlex>
      <div>
        <Userimage>
          <ImageComponent
            src={userPic ? `${import.meta.env.VITE_APP_IMG}${userPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
            alt="user-picture"
          />
        </Userimage>
        <UserDetails>
          <span>{displayName}</span>
          <span>@{userName}</span>
          <span>{getRoleLabel(role, t)}</span>
        </UserDetails>
      </div>
      <UserMenu>
        <Adduser
          pagestate={'edit'}
          userData={userProp}
        />
        <DelUserButton onClick={() =>
          swalWithBootstrapButtons
            .fire({
              title: t('deleteUserTitle'),
              text: t('notReverseText'),
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: t('confirmButton'),
              cancelButtonText: t('cancelButton'),
              reverseButtons: false,
            })
            .then((result) => {
              if (result.isConfirmed) {
                deleteUser(userId)
              }
            })}>
          <RiDeleteBin2Line />
        </DelUserButton>
      </UserMenu>
    </UsercardFlex>
  )
}
