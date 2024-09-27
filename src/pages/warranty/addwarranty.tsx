import { Col, Form, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead } from "../../style/style"
import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { useTranslation } from "react-i18next"
import { FormEvent, useState } from "react"
import { AddWarrantyButton } from "../../style/components/warranty.styled"
import { warrantyType } from "../../types/warranty.type"
import { useDispatch, useSelector } from "react-redux"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"
import { hospitalsType } from "../../types/hospital.type"
import { companyList } from "../../constants/constants"

type Hospital = {
  hosId: string,
  hosName: string,
}

type Company = {
  key: number,
  value: string,
}

interface AddWarrantyPropsType {
  pagestate: string,
  warData?: warrantyType,
  fetchData: () => void
}

interface WarrantyObjectType {
  devName?: string | undefined,
  productName?: string | undefined,
  productModel?: string | undefined,
  installDate?: string | undefined,
  customerName?: string | undefined,
  customerAddress?: string | undefined,
  saleDept?: string | undefined,
  invoice?: string | undefined,
  expire: string,
  warrStatus: boolean
}

type Option = {
  value: string,
  label: string,
}

interface WithCount {
  _count?: {
    warranty: number
  }
}

type WarrantyOption = WithCount & {
  devName: string,
  devSerial: string
}

export default function Addwarranty(warProps: AddWarrantyPropsType) {
  const { pagestate, warData, fetchData } = warProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode, reFetchData } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const hospitalsData = useSelector<DeviceStateStore, hospitalsType[]>((state) => state.arraySlice.hospital.hospitalsData)
  const { token } = cookieDecode
  const [show, setShowe] = useState(false)
  const [warrantyObject, setWarrantyObject] = useState({
    productName: warData?.productName ? warData?.productName : '',
    devSerial: warData?.productModel ? warData?.productModel : '',
    devName: warData?.device.devName ? warData?.device.devName : '',
    invoice: warData?.invoice ? warData?.invoice : '',
    installDate: warData?.installDate ? warData?.installDate.substring(0, 10) : '',
    expireData: warData?.expire ? warData?.expire.substring(0, 10) : '',
    customerName: warData?.customerName ? warData?.customerName : '',
    customerAddress: warData?.customerAddress ? warData?.customerAddress : '',
    saleDept: warData?.saleDept ? warData?.saleDept : '',
  })
  const { devName, expireData, installDate, invoice, devSerial, productName, customerAddress, customerName, saleDept } = warrantyObject
  const { theme } = useTheme()

  const openModal = () => {
    setShowe(true)
  }

  const closeModal = () => {
    setShowe(false)
  }

  const setHosId = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    const selectedLabel = e?.label
    if (!selectedValue) return
    setWarrantyObject({ ...warrantyObject, customerAddress: hospitalsData.filter((items) => items.hosId.toLowerCase().includes(selectedValue.toLowerCase())).map((items) => items.hosAddress)[0], customerName: String(selectedLabel) })
  }

  const setSaleDept = (e: SingleValue<Option>) => {
    const selectedLabel = e?.label
    if (!selectedLabel) return
    setWarrantyObject({ ...warrantyObject, saleDept: selectedLabel })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (devName !== '' && expireData !== '' && devSerial !== '' && invoice !== '' && installDate !== '' && productName !== '' && customerAddress !== '' && customerName !== '' && saleDept !== '') {
      const body: WarrantyObjectType = {
        devName: devName,
        productName: productName,
        customerAddress: customerAddress,
        customerName: customerName,
        installDate: installDate,
        productModel: devSerial,
        saleDept: saleDept,
        expire: expireData,
        invoice: invoice,
        warrStatus: true
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API}/warranty`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(setRefetchdata(!reFetchData))
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
      } finally {
        closeModal()
        fetchData()
        setWarrantyObject({ ...warrantyObject, devName: '', expireData: '', invoice: '', customerAddress: '', customerName: '', devSerial: '', installDate: '', productName: '', saleDept: '' })
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
    if (devName !== '' && expireData !== '' && devSerial !== '' && invoice !== '' && installDate !== '' && productName !== '' && customerAddress !== '' && customerName !== '' && saleDept !== '') {
      const body: WarrantyObjectType = {
        devName: devName,
        productName: productName,
        customerAddress: customerAddress,
        customerName: customerName,
        installDate: installDate,
        productModel: devSerial,
        saleDept: saleDept,
        expire: expireData,
        invoice: invoice,
        warrStatus: true
      }
      try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API}/warranty/${warData?.warrId}`, body, {
          headers: { authorization: `Bearer ${token}` }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        dispatch(setRefetchdata(!reFetchData))
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
      } finally {
        closeModal()
        fetchData()
        setWarrantyObject({ ...warrantyObject, devName: '', expireData: '', invoice: '', customerAddress: '', customerName: '', devSerial: '', installDate: '', productName: '', saleDept: '' })
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

  const mapOptions = <T extends WithCount, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.filter(item => item._count?.warranty === 0).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string,
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  const mapOptionsHospital = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValueHospital = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[labelKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <>
      {
        pagestate == 'add' ?
          <AddWarrantyButton onClick={openModal}>
            {t('addWarrantyButton')}
            <RiAddLine />
          </AddWarrantyButton>
          :
          <AddWarrantyButton onClick={openModal} $primary>
            <RiEditLine />
          </AddWarrantyButton>
      }
      <Modal size='lg' show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addWarrantyButton')
                  :
                  t('editWarranty')
              }
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          <Modal.Body>
            <Row>
              {/* <pre>
                {JSON.stringify(warrantyObject, null, 2)}
              </pre> */}
              <Col lg={12}>
                <Form.Label className="w-100">
                  {t('invoice')}
                  <Form.Control
                    type="text"
                    value={invoice}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, invoice: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col sm={12}>
                <Form.Label className="w-100">
                  {t('ชื่อผลิตภัณฑ์')}
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, productName: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              {
                pagestate === 'add' &&
                <Col lg={12}>
                  <Form.Label className="w-100">
                    {t('selectDeviceDrop')}
                    <Select
                      options={mapOptions<WarrantyOption, keyof WarrantyOption>(devices, 'devName', 'devSerial')}
                      defaultValue={mapDefaultValue<WarrantyOption, keyof WarrantyOption>(devices, String(devName), 'devName', 'devSerial')}
                      onChange={(e) => setWarrantyObject({ ...warrantyObject, devName: String(e?.value), devSerial: String(e?.label.substring(0, 3) === "eTP" ? 'eTEMP' : 'iTEMP') })}
                      autoFocus={false}
                      placeholder={t('selectDeviceDrop')}
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
                </Col>
              }
              <Col sm={12}>
                <Form.Label className="w-100">
                  {t('รุ่น')}
                  <Form.Control
                    type="text"
                    value={devSerial}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, devSerial: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Label className="w-100">
                  {t('วันที่ติดตั้ง')}
                  <Form.Control
                    type="date"
                    value={installDate}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, installDate: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Label className="w-100">
                  {t('endDate')}
                  <Form.Control
                    type="date"
                    value={expireData}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, expireData: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col sm={12}>
                <Form.Label className="w-100">
                  {t('ชื่อลูกค้า')}
                  <Select
                    options={mapOptionsHospital<Hospital, keyof Hospital>(hospitalsData, 'hosId', 'hosName')}
                    defaultValue={mapDefaultValueHospital<Hospital, keyof Hospital>(hospitalsData, String(customerName), 'hosId', 'hosName')}
                    onChange={setHosId}
                    autoFocus={false}
                    placeholder={t('selectDeviceDrop')}
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
              </Col>
              <Col sm={12}>
                <Form.Label className="w-100">
                  {t('ที่อยู่ลูกค้า')}
                  <Form.Control
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setWarrantyObject({ ...warrantyObject, customerAddress: e.target.value })}
                    className="mt-2"
                  />
                </Form.Label>
              </Col>
              <Col sm={12}>
                <Form.Label className="w-100">
                  {t('บริษัทจัดจำหน่าย')}
                  <Select
                    options={mapOptionsHospital<Company, keyof Company>(companyList, 'key', 'value')}
                    defaultValue={mapDefaultValueHospital<Company, keyof Company>(companyList, String(saleDept), 'key', 'value')}
                    onChange={setSaleDept}
                    autoFocus={false}
                    placeholder={t('selectDeviceDrop')}
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
              </Col>
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
