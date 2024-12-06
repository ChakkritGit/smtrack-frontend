import { Modal, Form, Row, Col, InputGroup } from "react-bootstrap"
import { AddUserButton, Checkboxbsoveride, FormBtn, FormFlexBtn, ModalHead, PasswordChangeFlex, ProfileFlex } from "../../style/style"
import { RiArrowLeftSLine, RiCloseLine, RiEditLine, RiLockPasswordLine, RiUserAddLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { ChangeEvent, FormEvent, useState } from "react"
import { adduserProp } from "../../types/prop.type"
import HospitalDropdown from "../../components/dropdown/hospitalDropdown"
import WardDropdown from "../../components/dropdown/wardDropdown"
import axios, { AxiosError } from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData } from "../../stores/userSlice"
import { RootState, storeDispatchType } from "../../stores/store"
import { responseType } from "../../types/response.type"
import { UserProfileType, usersType } from "../../types/user.type"
import { ImageComponent, resizeImage } from "../../constants/constants"
import { setShowAlert, setUserProfile } from "../../stores/utilsStateSlice"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"
import { ModalMuteHead } from "../../style/components/home.styled"
import { OpenResetPasswordModalButton } from "../../style/components/manage.user"
import axiosInstance from "../../constants/axiosInstance"
import DefualtUserPic from "../../assets/images/default-user.jpg"

type Option = {
  value: string,
  label: string,
}

type dataType = {
  value: string,
  name: string,
}

export default function Adduser(AdduserProp: adduserProp) {
  const { pagestate, userData } = AdduserProp
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { tokenDecode, cookieDecode, userProfile } = useSelector((state: RootState) => state.utilsState)
  const { token } = cookieDecode
  const { role } = tokenDecode
  const [show, setShow] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [form, setform] = useState({
    group_id: pagestate !== "add" ? String(userData?.userId) : '',
    user_name: pagestate !== "add" ? String(userData?.userName) : '',
    user_password: '',
    display_name: pagestate !== "add" ? String(userData?.displayName) : '',
    user_level: pagestate !== "add" ? String(userData?.userLevel) : '',
    user_status: pagestate !== "add" ? userData?.userStatus === true ? 1 : 0 : 0,
    fileupload: null as File | null,
  })
  const [hosid, setHosid] = useState('')
  const [userPicture, setUserPicture] = useState<string>(userData?.userPic ? `${import.meta.env.VITE_APP_IMG}${userData?.userPic}` : '')
  const { theme } = useTheme()
  const [pass, setPass] = useState({
    oldPassword: '',
    newPassword: ''
  })
  const { oldPassword, newPassword } = pass
  const [showpassword, setShowpassword] = useState(false)

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
    setHosid('')
  }

  const openModalPass = () => {
    closeModal()
    setShowPass(true)
  }

  const closeModalPass = () => {
    setShowPass(false)
    openModal()
  }

  const fileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    const fileInput = e.target
    if (e.target && fileInput.files && e.target.files && e.target.files.length > 0) {
      const selectedFile = fileInput.files[0]

      await resizeImage(selectedFile)
        .then((resizedFile) => {
          reader.readAsDataURL(resizedFile)
          reader.onload = (event) => {
            let img = event.target?.result
            setUserPicture(img as string)
          }
          setform({ ...form, fileupload: resizedFile })
        })
        .catch((error) => {
          console.error('Error resizing image:', error)
        })
    }
  }

  const setValuestate = (value: string) => {
    setform({ ...form, group_id: value })
  }

  const setLevel = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setform({ ...form, user_level: selectedValue })
  }

  const setStatus = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setform({ ...form, user_status: Number(selectedValue) })
  }

  const reFetchdata = async () => {
    if (tokenDecode.id) {
      try {
        const response = await axios
          .get<responseType<UserProfileType>>(`${import.meta.env.VITE_APP_API}/user/${tokenDecode.id}`, { headers: { authorization: `Bearer ${token}` } })
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/auth/register`
    const formData = new FormData()
    formData.append('wardId', form.group_id)
    formData.append('userName', form.user_name)
    formData.append('userPassword', form.user_password)
    formData.append('displayName', form.display_name)
    formData.append('userLevel', form.user_level)
    if (form.fileupload) {
      formData.append('fileupload', form.fileupload as File)
    }
    formData.append('createBy', String(userProfile?.display))
    if (form.group_id !== '' && form.user_name !== '' && form.user_password !== '' && form.display_name !== '' && form.user_level !== '') {
      try {
        const response = await axiosInstance.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })
        setShow(false)
        setHosid('')
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.msg,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setform({
          group_id: '',
          user_name: '',
          user_password: '',
          display_name: '',
          user_level: '',
          user_status: 0,
          fileupload: null as File | null,
        })
        dispatch(fetchUserData(token))
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

  const handleSubmitEdit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/user/${userData?.userId}`
    const formData = new FormData()
    formData.append('userName', form.user_name)
    formData.append('displayName', form.display_name)
    formData.append('userLevel', form.user_level)
    formData.append('userStatus', String(form.user_status))
    if (form.fileupload) {
      formData.append('fileupload', form.fileupload as File)
    }
    formData.append('createBy', String(userProfile?.display))
    if (form.group_id !== '' && form.user_name !== '' && form.display_name !== '' && form.user_level !== '') {
      try {
        const response = await axiosInstance.put<responseType<usersType>>(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        setShow(false)
        setHosid('')
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(fetchUserData(token))
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
        text: t('complete_field'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleSubmitPassReset = async (e: FormEvent) => {
    e.preventDefault()
    if (role === 'SUPER' || role === 'SERVICE' ? (newPassword !== '') : (newPassword !== '' && oldPassword !== '')) {
      try {
        const response = await axiosInstance.patch(`${import.meta.env.VITE_APP_API}/auth/reset/${userData?.userId}`, {
          oldPassword: oldPassword,
          password: newPassword
        })
        setShowPass(false)
        setPass({ newPassword: '', oldPassword: '' })
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

  const userlevel =
    role === 'SUPER' ?
      [{ value: 'SUPER', name: t('levelSuper') },
      { value: 'SERVICE', name: t('levelService') },
      { value: 'ADMIN', name: t('levelAdmin') },
      { value: 'USER', name: t('levelUser') },
      { value: 'LEGACY_ADMIN', name: "LEGACY_ADMIN" },
      { value: 'LEGACY_USER', name: "LEGACY_USER" },
      { value: 'GUEST', name: "GUEST" },
    ]
      :
      role === 'SERVICE' ?
        [{ value: 'SERVICE', name: t('levelService') },
        { value: 'ADMIN', name: t('levelAdmin') },
        { value: 'USER', name: t('levelUser') },]
        :

        [{ value: 'ADMIN', name: t('levelAdmin') },
        { value: 'USER', name: t('levelUser') },]


  const userstatus = [
    { value: '1', name: t('userActive') },
    { value: '0', name: t('userInactive') }
  ]

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <>
      {pagestate === "add" ?
        <AddUserButton onClick={openModal} style={{ width: 'max-content', height: '45px' }}>
          {t('addUserButton')}
          <RiUserAddLine />
        </AddUserButton>
        : <AddUserButton onClick={openModal} $primary>
          <RiEditLine />
        </AddUserButton>}

      <Modal size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addUserButton')
                  :
                  t('editUserButton')
              }
            </strong>
            {/* <pre>{JSON.stringify(form, null, 2)}</pre> */}
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {
                pagestate === "add" ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userHospitals')}
                        <HospitalDropdown
                          setHos_id={setHosid}
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userWard')}
                    <WardDropdown
                      setStateWard={setValuestate}
                      Hosid={pagestate === "add" ? hosid : String(userData?.hosId)}
                      groupId={String(userData?.wardId)}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userNameForm')}
                    <Form.Control
                      name="fieldUsername"
                      autoComplete='off'
                      type='text'
                      value={form.user_name}
                      onChange={(e) => setform({ ...form, user_name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate === "add" ?
                  <Col lg={6}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('userPassword')}
                        <Form.Control
                          name="fieldUserpassword"
                          autoComplete='off'
                          type='password'
                          value={form.user_password}
                          onChange={(e) => setform({ ...form, user_password: e.target.value })}
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userDisplayName')}
                    <Form.Control
                      name="fieldDisplayname"
                      autoComplete='off'
                      type='text'
                      value={form.display_name}
                      onChange={(e) => setform({ ...form, display_name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userRole')}
                    <Select
                      options={mapOptions<dataType, keyof dataType>(userlevel, 'value', 'name')}
                      value={mapDefaultValue<dataType, keyof dataType>(userlevel, form.user_level, 'value', 'name')}
                      onChange={setLevel}
                      autoFocus={false}
                      placeholder={t('selectRole')}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('userPicture')}
                    <ProfileFlex $radius={10} $dimension={250} $imageFit>
                      <div>
                        <ImageComponent src={userPicture ? userPicture : DefualtUserPic} alt="down-picture" />
                        <label htmlFor={'user-file-upload'} >
                          <RiEditLine />
                          <input id="user-file-upload" type="file" accept="image/gif, image/jpg, image/jpeg, image/png" onChange={fileSelect} />
                        </label>
                      </div>
                    </ProfileFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              {
                pagestate !== "add" ?
                  <Col lg={6}>
                    <Col lg={12}>
                      <InputGroup className="mb-3">
                        <Form.Label className="w-100">
                          {t('userStatus')}
                          <Select
                            options={mapOptions<dataType, keyof dataType>(userstatus, 'value', 'name')}
                            value={mapDefaultValue<dataType, keyof dataType>(userstatus, String(form.user_status), 'value', 'name')}
                            onChange={setStatus}
                            autoFocus={false}
                            placeholder={t('selectStatus')}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                                borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                                boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                                borderRadius: "var(--border-radius-big)"
                              }),
                            }}
                            theme={(theme) => ({
                              ...theme,
                              colors: {
                                ...theme.colors,
                                primary50: 'var(--main-color-opacity2)',
                                primary25: 'var(--main-color-opacity2)',
                                primary: 'var(--main-color)',
                              },
                            })}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </Form.Label>
                      </InputGroup>
                    </Col>
                    <Col lg={12}>
                      <OpenResetPasswordModalButton type="button" onClick={openModalPass}>
                        <RiLockPasswordLine size={24} />
                        <span>{t('titlePassword')}</span>
                      </OpenResetPasswordModalButton>
                    </Col>
                  </Col>
                  :
                  <>
                  </>
              }
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPass} onHide={closeModalPass}>
        <Modal.Header>
          <ModalHead>
            <ModalMuteHead onClick={closeModalPass}>
              <button>
                <RiArrowLeftSLine />
              </button>
              <span>
                {t('titlePassword')}
              </span>
            </ModalMuteHead>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmitPassReset}>
          <Modal.Body>
            <Row>
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
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
