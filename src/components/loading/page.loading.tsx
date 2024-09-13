import { RiCloseLine, RiLoader2Line } from "react-icons/ri"
import { FailedtoLoad, PageLoadContainer } from "../../style/components/page.loading"
import Loading from "./loading"
import { useTranslation } from "react-i18next"
import { useState } from "react"

const PageLoading = () => {
  const { t } = useTranslation()
  const [timeOut, setTimeOut] = useState(false)

  setInterval(() => {
    setTimeOut(true)
  }, 8000)

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