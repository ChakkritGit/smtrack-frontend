import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import {
  AccountContainer, Checkboxbsoveride, EditProfileButton, FormBtn, FormFlexBtn, LineHr, ModalHead,
  PasswordChangeFlex, ProfileFlexSetting, SecurityFlex, SecurityPasswordBtn
} from "../../style/style"
import { RiCloseLine, RiEditLine } from "react-icons/ri"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { responseType } from "../../types/response.type"
import { UserProfileType, usersType } from "../../types/user.type"
import { ImageComponent, resizeImage } from "../../constants/constants"
import { RootState, storeDispatchType } from "../../stores/store"
import { setShowAlert, setUserProfile } from "../../stores/utilsStateSlice"
import axiosInstance from "../../constants/axiosInstance"
import DefualtUserPic from "../../assets/images/default-user.jpg"

export default function Account() {
  const [userpicture, setUserpicture] = useState<string>('')
  const { cookieDecode, tokenDecode, userProfile } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const [show, setshow] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [pass, setPass] = useState({
    oldPassword: '',
    newPassword: ''
  })
  const { oldPassword, newPassword } = pass
  const [showpassword, setShowpassword] = useState(false)
  const [userData, setUserData] = useState<UserProfileType>()
  const [userDisplayName, setUserDisplayName] = useState<string>('')
  const { role } = tokenDecode

  const openmodalProfile = () => {
    setShowProfile(true)
  }

  const closemodalProfile = () => {
    setShowProfile(false)
  }

  const openmodal = () => {
    setshow(true)
  }

  const closemodal = () => {
    setshow(false)
  }

  const reFetchdata = async () => {
    if (cookieDecode) {
      try {
        const response = await axiosInstance
          .get<responseType<UserProfileType>>(`${import.meta.env.VITE_APP_API}/user/${cookieDecode.id}`, { headers: { authorization: `Bearer ${token}` } })
          setUserData(response.data.data)
          dispatch(setUserProfile(response.data.data))
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
    }
  }

  const handleChang = async (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const url: string = `${import.meta.env.VITE_APP_API}/user/${cookieDecode.id}`
    const formData = new FormData()

    if (e.target && e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]

      // Resize the image before setting the state
      await resizeImage(selectedFile)
        .then((resizedFile) => {
          reader.readAsDataURL(resizedFile)
          reader.onload = (event) => {
            let img = event.target?.result
            setUserpicture(img as string)
          }
          formData.append('fileupload', resizedFile)
        })
        .catch((error) => {
          console.error('Error resizing image:', error)
        })

      try {
        const response = await axios
          .put<responseType<usersType>>(url, formData, {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${token}`
            }
          })
        toast.success(response.data.message)
        reFetchdata()
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message)
          if (error.response?.status === 401) {
            dispatch(setShowAlert(true))
          } else {
            console.error('Something wrong' + error)
          }
        } else {
          toast.error('Unknown Error')
          console.error('Uknown error: ', error)
        }
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (role === 'SUPER' || role === 'SERVICE' ? (newPassword !== '') : (newPassword !== '' && oldPassword !== '')) {
      try {
        const response = await axiosInstance.patch(`${import.meta.env.VITE_APP_API}/auth/reset/${cookieDecode.id}`, {
          oldPassword: oldPassword,
          password: newPassword
        })
        setshow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.data,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        reFetchdata()
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleSubmitProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (userDisplayName !== '') {
      try {
        const response = await axiosInstance.put(`${import.meta.env.VITE_APP_API}/user/${cookieDecode.id}`, {
          displayName: userDisplayName
        })
        setShowProfile(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        reFetchdata()
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  useEffect(() => {
    reFetchdata()
  }, [])

  return (
    <AccountContainer>
      <h3>{t('titleProfile')}</h3>
      <ProfileFlexSetting $radius={50} $dimension={150} $imageFit>
        <div>
          <div>
            <ImageComponent src={userpicture ? userpicture : userProfile?.pic ? userProfile.pic : DefualtUserPic} alt="user-picture" />
            <label htmlFor={'user-file-upload'} >
              <RiEditLine />
              <input id="user-file-upload" type="file" accept="image/gif, image/jpg, image/jpeg, image/png" onChange={handleChang} />
            </label>
          </div>
          <div>
            <h5>{userProfile?.display}</h5>
            <span>@{userData?.username}</span>
          </div>
        </div>
        <div>
          <EditProfileButton onClick={openmodalProfile}>
            <RiEditLine />
            {t('editButton')}
          </EditProfileButton>
        </div>
      </ProfileFlexSetting>
      <LineHr />
      <h3>{t('titleSecurity')}</h3>
      <SecurityFlex>
        <span>{t('titlePassword')}</span>
        <SecurityPasswordBtn onClick={openmodal}>
          {t('changPassword')}
        </SecurityPasswordBtn>
      </SecurityFlex>

      <Modal show={showProfile} onHide={closemodalProfile}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('editButton')}
            </strong>
            <button onClick={closemodalProfile}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmitProfile}>
          <Modal.Body>
            <Row>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userDisplayName')}
                    <Form.Control
                      spellCheck={false}
                      autoComplete='off'
                      type={'text'}
                      value={userDisplayName}
                      onChange={(e) => setUserDisplayName(e.target.value)}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('changPassword')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('titlePassword')}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              {
                role === 'ADMIN' || role === 'USER' && <Col lg={12}>
                  <InputGroup className="mb-3">
                    <Form.Label className="w-100">
                      {t('oldPassword')}
                      <Form.Control
                        spellCheck={false}
                        autoComplete='off'
                        type={showpassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setPass({ ...pass, oldPassword: e.target.value })}
                      />
                    </Form.Label>
                  </InputGroup>
                </Col>
              }
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('newPassword')}
                    <Form.Control
                      spellCheck={false}
                      autoComplete='off'
                      type={showpassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
                <PasswordChangeFlex $primary={newPassword.length}>
                  <div></div>
                  <span>
                    {
                      newPassword.length === 0 ?
                        t('passLower')
                        :
                        newPassword.length < 4 ?
                          t('passLow')
                          :
                          newPassword.length < 8 ?
                            t('passNormal')
                            :
                            newPassword.length < 12 ?
                              t('passGood')
                              :
                              t('passExcellent')
                    }
                  </span>
                </PasswordChangeFlex>
                <Form.Group className="mb-3">
                  <Checkboxbsoveride>
                    <Form.Check
                      inline
                      label={t('showPass')}
                      type="checkbox"
                      checked={showpassword}
                      onChange={() => setShowpassword(!showpassword)}
                    />
                  </Checkboxbsoveride>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('changPassword')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </AccountContainer>
  )
}
