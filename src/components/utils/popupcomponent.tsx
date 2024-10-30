import { Toaster } from "react-hot-toast"
import TokenExpiredAlert from "../navigation/TokenExpiredAlert"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"

export default function Popupcomponent() {
  const { showAlert } = useSelector((state: RootState) => state.utilsState)

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
