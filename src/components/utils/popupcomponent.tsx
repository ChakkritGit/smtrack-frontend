import { Toaster } from "react-hot-toast"
import TokenExpiredAlert from "../navigation/TokenExpiredAlert"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"

export default function Popupcomponent() {
  const { showAlert } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      {showAlert && <TokenExpiredAlert />}
    </>
  )
}
