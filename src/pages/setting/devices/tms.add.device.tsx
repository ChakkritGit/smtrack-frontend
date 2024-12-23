import { RiAddLine, RiCloseLine } from "react-icons/ri"
import { AddDevices, FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { FormEvent, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import HospitalDropdown from "../../../components/dropdown/hospitalDropdown"
import WardDropdown from "../../../components/dropdown/wardDropdown"
import Swal from "sweetalert2"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { storeDispatchType } from "../../../stores/store"
import { setShowAlert } from "../../../stores/utilsStateSlice"
import axiosInstance from "../../../constants/axiosInstance"

interface TmsAddDeviceProps {
  fetchDevice: (page: number, size?: number) => Promise<void>
}

const TmsAddDevice = (addProps: TmsAddDeviceProps) => {
  const { fetchDevice } = addProps
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const [show, setShow] = useState(false)
  const [hosId, sethosId] = useState('')
  const [wardId, setwardId] = useState('')
  const [deviceData, setDeviceData] = useState({
    serial: '',
    name: ''
  })
  const { serial, name } = deviceData

  const setValuestate = (value: string) => {
    setwardId(value)
  }

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
    resetState()
  }

  const resetState = () => {
    setwardId('')
    sethosId('')
    setDeviceData({
      serial: '',
      name: ''
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (hosId !== "" && wardId !== "" && serial !== "") {
      try {
        const response = await axiosInstance.post(`${import.meta.env.VITE_APP_API}/legacy/device`, {
          ward: wardId,
          hospital: hosId,
          sn: serial,
          name: name
        })
        setShow(false)
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        fetchDevice(1)
        resetState()
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

  return (
    <>
      <AddDevices onClick={openModal}>
        {t('addDeviceButton')}
        <RiAddLine />
      </AddDevices>
      <Modal size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              {t('addDeviceButton')}
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('hospitals')}
                    <HospitalDropdown
                      setHos_id={sethosId}
                      Hosid={hosId}
                      key={hosId}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('ward')}
                    <WardDropdown
                      setStateWard={setValuestate}
                      Hosid={hosId}
                      groupId={wardId}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceSerialTb')}
                    <Form.Control
                      name='formSerial'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={serial}
                      onChange={(e) => setDeviceData({ ...deviceData, serial: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('deviceNameTb')}
                    <Form.Control
                      name='formSerial'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={name}
                      onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('submitButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default TmsAddDevice