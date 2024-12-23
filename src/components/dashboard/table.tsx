import { RiFileForbidLine, RiFullscreenLine } from "react-icons/ri"
import { ChartCardHeah, ChartCardHeahBtn, TableContainer } from "../../style/style"
import { logtype } from "../../types/log.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { cookieOptions, cookies } from "../../constants/constants"
import { RootState } from "../../stores/store"
import { NoRecordContainer } from "../../style/components/datatable.styled"

type TableType = {
  data: logtype[],
  devSn: string,
  devStatus: boolean,
  tempMin: number,
  tempMax: number
}

export default function Table(tablesData: TableType) {
  const { t } = useTranslation()
  const { data, devSn, tempMin, tempMax } = tablesData
  const { searchQuery } = useSelector((state: RootState) => state.utilsState)
  const [tableData, setTableData] = useState<logtype[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const filtered = data.filter((items) =>
      items.sendTime && items.sendTime.substring(11, 16).toLowerCase().includes(searchQuery.toLowerCase()))

    setTableData(filtered)
  }, [searchQuery])

  const columns: TableColumn<logtype>[] = [
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
      cell: () => <span title={devSn}>...{devSn.substring(17)}</span>,
      sortable: false,
      center: true
    },
    {
      name: t('deviceTime'),
      cell: (item) => item.sendTime.substring(11, 16),
      sortable: false,
      center: false
    },
    {
      name: t('probsmtrackSubTb'),
      cell: (item) => item.tempAvg.toFixed(2) + '°C',
      sortable: false,
      center: false
    },
    {
      name: t('probeHumiSubTb'),
      cell: (item) => item.humidityAvg.toFixed(2) + '%',
      sortable: false,
      center: false
    },
    {
      name: t('deviceConnectTb'),
      cell: (item) => item.internet === '0' ? t('deviceOnline') : t('deviceOffline'),
      sortable: false,
      center: true
    },
  ]

  const openFulltable = () => {
    cookies.set('devSerial', data ? data[0].devSerial : '', cookieOptions)
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
