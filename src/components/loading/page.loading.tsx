import { RiFileCloseLine } from "react-icons/ri"
import { FailedtoLoad } from "../../style/components/page.loading"
import { useEffect, useState } from "react"
import LazyLoadComponent from "./lazy.load.component"
import { useTranslation } from "react-i18next"

type state = {
  reset?: number
}

const PageLoading = (state: state) => {
  const { t } = useTranslation()
  const [timeOut, setTimeOut] = useState(false)

  useEffect(() => {
    setTimeOut(false)
  }, [state.reset])

  setInterval(() => {
    setTimeOut(true)
  }, 15000)

  return (
    <>
      {
        !timeOut ?
          <LazyLoadComponent />
          :
          <FailedtoLoad>
            <div>
              <RiFileCloseLine size={42} />
              <span>{t('nodata')}</span>
              <div></div>
            </div>
          </FailedtoLoad>
      }
    </>
  )
}

export default PageLoading