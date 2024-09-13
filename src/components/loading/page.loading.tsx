import { RiCloseLine, RiLoader2Line } from "react-icons/ri"
import { FailedtoLoad, PageLoadContainer } from "../../style/components/page.loading"
import Loading from "./loading"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

type state = {
  reset: number
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
          <PageLoadContainer>
            <Loading loading={true} title={t('loading')} icn={<RiLoader2Line />} />
          </PageLoadContainer>
          :
          <FailedtoLoad>
            <div>
              <RiCloseLine size={32}/>
              <span>Failed to load data</span>
            </div>
          </FailedtoLoad>
      }
    </>
  )
}

export default PageLoading