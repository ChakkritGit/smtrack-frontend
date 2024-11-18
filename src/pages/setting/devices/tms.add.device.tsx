import { RiAddLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { AddDevices, FormBtn, FormFlexBtn, ModalHead } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { TmsManagedevices } from "../../../types/device.type"
import { useState } from "react"
import { Form, Modal } from "react-bootstrap"

const TmsAddDevice = (TmsAddDevProps: TmsManagedevices) => {
  const { t } = useTranslation()
  const { pagestate } = TmsAddDevProps
  const [show, setShow] = useState(false)

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const handleSubmit = () => {

  }

  const handleSubmitEdit = () => {

  }

  return (
    <>
      {
        pagestate === "add" ?
          <AddDevices onClick={openModal}>
            {t('addDeviceButton')}
            <RiAddLine />
          </AddDevices>
          :
          <AddDevices onClick={openModal} $primary>
            <RiEditLine size={16} />
          </AddDevices>
      }
      <Modal size="lg" show={show} onHide={closeModal}>
        <Modal.Header>
          {/* <pre>
            {JSON.stringify(formdata, null, 2)}
          </pre> */}
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addDeviceButton')
                  :
                  t('editDeviceButton')
              }
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitEdit}>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <FormFlexBtn>
            <FormBtn type="submit">
              {t('submitButton')}
            </FormBtn>
          </FormFlexBtn>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default TmsAddDevice