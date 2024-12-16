import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { DashboardFlex, DashboardHeadFilter, LineHr } from "../../style/style"
import { Container } from "react-bootstrap"
import Dropdown from "../../components/dashboard/dropdown"
import FilterHosWardTemporary from "../../components/dropdown/filter.hos.ward.temp"
import { useState } from "react"

const TmsDashboard = () => {
  const { devices } = useSelector((state: RootState) => state.tmsDevice)
  const { expand } = useSelector((state: RootState) => state.utilsState)
  const [filterById, setFilterById] = useState({
      hosId: '',
      wardId: ''
    })
    const { hosId, wardId } = filterById

  return (
    <Container fluid>
      <DashboardFlex>
      <DashboardHeadFilter $primary={expand}>
          <Dropdown
            hosId={hosId}
            wardId={wardId}
          />
          <FilterHosWardTemporary
            filterById={filterById}
            setFilterById={setFilterById}
          />
        </DashboardHeadFilter>
        <span>จำนวนข้อมูล: {devices.length}</span>
        <LineHr />
        <pre>
          {JSON.stringify(devices, null, 2)}
        </pre>
      </DashboardFlex>
    </Container>
  )
}

export default TmsDashboard