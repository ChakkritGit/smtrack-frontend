import { useEffect, useState } from "react"
import { historyType } from "../../../types/hostory.type"
import axios, { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { responseType } from "../../../types/response.type"
import DataTable, { TableColumn } from "react-data-table-component"
import { LineHr, ManageHistoryBody, ModalHead } from "../../../style/style"
import { useTranslation } from "react-i18next"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import { RootState, storeDispatchType } from "../../../stores/store"
import { Modal } from "react-bootstrap"
import { RiCloseLine } from "react-icons/ri"
import { DetailsFlex, LogDetailsButton } from "../../../style/components/log.update"

export default function AdjustLog() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { cookieDecode, searchQuery } = useSelector((state: RootState) => state.utilsState)
  const { userData } = useSelector((state: RootState) => state.user)
  const { token } = cookieDecode
  const [history, setHistory] = useState<historyType[]>([])
  const [detail, setDetail] = useState<historyType>({} as historyType)
  const [show, setShow] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const openDetail = (detail: historyType) => {
    openModal()
    setDetail(detail)
  }

  const fetchHistory = async () => {
    try {
      const response = await axios.get<responseType<historyType[]>>(`${import.meta.env.VITE_APP_API}/utils/history`, {
        headers: { authorization: `Bearer ${token}` }
      })
      setHistory(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  useEffect(() => {
    if (!token) return
    fetchHistory()
  }, [token])

  const columns: TableColumn<historyType>[] = [{
    name: t('noNumber'),
    selector: (_, index) => Number(index) + 1,
    sortable: false,
    center: true
  },
  {
    name: t('hisDetail'),
    cell: (items, index) => <LogDetailsButton key={index} onClick={() => openDetail(items)}>{t('hisDetail')}</LogDetailsButton>,
    sortable: false,
    center: true
  },
  {
    name: t('deviceSerialTb'),
    selector: (items) => items.devSerial,
    sortable: false,
    center: true
  },
  {
    name: t('hisUsername'),
    selector: ({ userId }) => userData.find(({ userId: id }) => id === userId)?.displayName || "- -",
    sortable: false,
    center: true
  },
  {
    name: t('deviceTime'),
    selector: (items) => `${new Date(items.createAt).toLocaleString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    })} ${new Date(items.createAt).toLocaleString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    })}`,
    sortable: false,
    center: true
  }
  ]

  // Filter Data
  const filteredItems = history.length > 0 ? history.filter(item => item.devSerial && item.devSerial.toLowerCase().includes(searchQuery.toLowerCase())) : []

  // format json
  const formatJson = (jsonStr: string) => {
    const dataString = jsonStr?.replace("Probe: [", "").replace(" ]", "")

    const dataArray = dataString?.split(" ").map(pair => pair.split(":"))

    const probeData: any = {}
    dataArray?.forEach(([key, value]) => {
      probeData[key] = parseFloat(value)
    })

    return probeData
  }

  return (
    <ManageHistoryBody>
      <h3 className="my-3">{t('tabAdjustHistory')}</h3>
      <DataTable
        columns={columns}
        data={filteredItems}
        paginationRowsPerPageOptions={[10, 30, 50, 80, 100, 150, 200, 300, 500]}
        paginationPerPage={10}
        pagination
        responsive
        fixedHeader
        fixedHeaderScrollHeight="calc(100dvh - 330px)"
      />
      <Modal size="lg" show={show} onHide={closeModal} scrollable>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('hisDetail')}
            </strong>
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body>
          <DetailsFlex>
            <span>{t('deviceSnBox')}: {detail.devSerial}</span>
            <span>{t('userDisplayName')}: {userData.find(({ userId: id }) => id === detail.userId)?.displayName || "- -"}</span>
            <span>{t('deviceDate')}: {`${new Date(detail.createAt).toLocaleString('th-TH', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC'
            })} ${new Date(detail.createAt).toLocaleString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC'
            })}`}</span>
            <pre>
              <span>{t('hisDetail')}</span>
              <LineHr />
              {JSON.stringify(formatJson(detail.detail), null, 2)}
            </pre>
          </DetailsFlex>
        </Modal.Body>
      </Modal>
    </ManageHistoryBody>
  )
}
