import { RiSettings3Line } from "react-icons/ri"
import { CardDevBtn, DeviceCardHeadHandle } from "../../style/style"
import ModalAdjust from "./modal.adjust"
import { useState } from "react"
import { devicesType } from "../../types/device.type"
import { AsyncThunk } from "@reduxjs/toolkit"

type TableModalProps = {
  deviceData: devicesType,
  fetchData: AsyncThunk<devicesType[], string, {}>,
}

const TableModal = (tableModalProps: TableModalProps) => {
  const { deviceData, fetchData } = tableModalProps
  const [show, setShow] = useState(false)
  const openmodal = () => {
    setShow(true)
  }

  return (
    <>
      <DeviceCardHeadHandle>
        <CardDevBtn onClick={openmodal}>
          <RiSettings3Line />
        </CardDevBtn>
      </DeviceCardHeadHandle>

      <ModalAdjust
        key={deviceData.devId}
        fetchData={fetchData}
        devicesdata={deviceData}
        show={show}
        setShow={setShow}
      />
    </>
  )
}

export default TableModal