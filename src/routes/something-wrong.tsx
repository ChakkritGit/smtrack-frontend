import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate, useRouteError } from "react-router-dom"
import { SomethingWrongPageStyled } from "../style/components/error.page"
import { RiAlertFill } from "react-icons/ri"

export default function SomethingWrong() {
  const { t, i18n } = useTranslation()
  const pathName = useLocation()
  const navigate = useNavigate()
  const error = useRouteError()
  const langs = localStorage.getItem("lang")
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    if (error instanceof ReferenceError) {
      setErrorText(String(error.message))
      console.error(error)
    } else {
      console.error(error)
    }
  }, [error])

  return (
    <SomethingWrongPageStyled>
      <RiAlertFill size={64} color="Yellow" />
      <h1>{t('titleError')}</h1>
      <p>{t('descriptionErrorWrong')}</p>
      <pre>
        {errorText.toString()}
      </pre>
      <p>
        {
          pathName.pathname !== '/' && <i onClick={() => navigate('/')}>{t('buttonErrorBack')}</i>
        }
      </p>
    </SomethingWrongPageStyled>
  )
}
