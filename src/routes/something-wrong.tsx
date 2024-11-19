import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate, useRouteError } from "react-router-dom"
import { SomethingWrongPageStyled, TabLightPage } from "../style/components/error.page"
import { RiAlertFill } from "react-icons/ri"
import { useTheme } from "../theme/ThemeProvider"

export default function SomethingWrong() {
  const { t, i18n } = useTranslation()
  const pathName = useLocation()
  const navigate = useNavigate()
  const error = useRouteError()
  const langs = localStorage.getItem("lang")
  const [errorText, setErrorText] = useState('')
  const { theme } = useTheme()

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
      setErrorText(String(error))
      console.error(error)
    }
  }, [error])

  return (
    <SomethingWrongPageStyled>
      <TabLightPage $bgColor="rgba(200, 0, 0, 0.4)" $shadowColor="rgba(200, 0, 0, 0.7)" />
      <RiAlertFill size={64} color={theme.mode === 'dark' ? 'Yellow' : 'var(--main-dark-color)'} />
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
