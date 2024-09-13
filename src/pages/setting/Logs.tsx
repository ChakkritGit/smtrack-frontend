import axios, { AxiosError } from "axios"
import { FormEvent, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { DeviceStateStore, UtilsStateStore } from "../../types/redux.type"
import Swal from "sweetalert2"
import { useTranslation } from "react-i18next"
import { formattedDate, yearMonth } from "../../constants/constants"

function Logs() {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [dateFormatted, setDateFormatted] = useState({
    month: yearMonth,
    day: formattedDate
  })
  const [autoScroll, setAutoScroll] = useState(true)
  const preRef = useRef<HTMLPreElement>(null)
  let firstLoad = true

  const fetchText = async (date: string, datetime: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API}/logs/${date}/log_${datetime}.log`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      setText(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      } else {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (!token) return
    if (firstLoad) {
      fetchText(dateFormatted.month, dateFormatted.day)
      firstLoad = false
    }

    const intervalId = setInterval(() => {
      fetchText(dateFormatted.month, dateFormatted.day)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [token, dateFormatted])

  useEffect(() => {
    if (autoScroll && preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight
    }
  }, [text, autoScroll])

  const handleScroll = () => {
    if (preRef.current) {
      const isAtBottom = preRef.current.scrollHeight - preRef.current.scrollTop === preRef.current.clientHeight
      setAutoScroll(isAtBottom)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (date !== '') {
      try {
        const yearMonth = date.split('-')[0] + date.split('-')[1]
        const yearMonthDay = date.split('-')[0] + date.split('-')[1] + date.split('-')[2]
        setDateFormatted({ ...dateFormatted, month: yearMonth, day: yearMonthDay })
      } catch (error) {
        console.error(error)
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="date" onChange={(e) => setDate(e.target.value)} value={date} />
        <button type="submit">search</button>
      </form>
      <pre
        ref={preRef}
        onScroll={handleScroll}
        style={{ maxHeight: 'calc(100dvh - 200px)', overflowY: 'auto' }}
      >
        {text}
      </pre>
    </div>
  )
}

export default Logs
