import { useTranslation } from "react-i18next"
import { TmsLogType } from "../../types/tms.type"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DataTable, { TableColumn } from "react-data-table-component"
import { cookieOptions, cookies } from "../../constants/constants"
import { ChartCardHeah, ChartCardHeahBtn, TableContainer } from "../../style/style"
import { RiFileForbidLine, RiFullscreenLine } from "react-icons/ri"
import { NoRecordContainer } from "../../style/components/datatable.styled"

type TableType = {
  data: TmsLogType[],
  devSn: string,
  tempMin: number,
  tempMax: number
}


const TmsTable = (tablesData: TableType) => {
  const { t } = useTranslation()
  const { data, devSn, tempMin, tempMax } = tablesData
  const { searchQuery } = useSelector((state: RootState) => state.utilsState)
  const [tableData, setTableData] = useState<TmsLogType[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const filtered = data.filter((items) =>
      items.time && items.time.substring(11, 16).toLowerCase().includes(searchQuery.toLowerCase())).reverse()

    setTableData(filtered)
  }, [searchQuery])

  const columns: TableColumn<TmsLogType>[] = [
    {
      name: t('deviceNoTb'),
      cell: (_, index) => {
        return <div>{tableData.length - index}</div>
      },
      sortable: false,
      center: true
    },
    {
      name: t('deviceSerialTb'),
      cell: () => <span title={devSn}>...{devSn.substring(7)}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: (item) => item.createdAt.substring(11, 16),
      sortable: false,
      center: false
    },
    {
      name: t('probsmtrackSubTb'),
      cell: (item) => item.tempValue.toFixed(2) + '°C',
      sortable: false,
      center: false
    },
    // {
    //   name: t('deviceConnectTb'),
    //   cell: (item) => item.internet ? t('deviceOffline') : t('deviceOnline'),
    //   sortable: false,
    //   center: true
    // },
  ]


  const openFulltable = () => {
    cookies.set('devSerial', devSn ? devSn : '', cookieOptions)
    navigate(`/dashboard/table`, { state: { tempMin: tempMin, tempMax: tempMax } })
    window.scrollTo(0, 0)
  }

  return (
    <TableContainer>
      <ChartCardHeah>
        <span>{t('pageTable')}</span>
        <ChartCardHeahBtn onClick={openFulltable}>
          <RiFullscreenLine />
        </ChartCardHeahBtn>
      </ChartCardHeah>
      <DataTable
        responsive={true}
        columns={columns}
        data={tableData}
        pagination
        paginationRowsPerPageOptions={[12, 30, 50, 100]}
        paginationPerPage={12}
        noDataComponent={<NoRecordContainer>
          <RiFileForbidLine size={32} />
          <h4>{t('nodata')}</h4>
        </NoRecordContainer>}
        dense
        fixedHeader
        fixedHeaderScrollHeight="420px"
      />
    </TableContainer>
  )
}

export default TmsTable