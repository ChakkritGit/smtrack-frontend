import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { LineHr } from "../../style/style"

const TmsDashboard = () => {
  const { devices } = useSelector((state: RootState) => state.tmsDevice)
  return (
    <div>
      <span>จำนวนข้อมูล: {devices.length}</span>
      <LineHr />
      <pre>
        {JSON.stringify(devices, null, 2)}
      </pre>
    </div>
  )
}

export default TmsDashboard