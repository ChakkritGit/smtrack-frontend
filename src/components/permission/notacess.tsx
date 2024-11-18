import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { AccessDenied, TabLightPage } from "../../style/components/error.page"
import { RiAlertFill } from "react-icons/ri"
import { useTheme } from "../../theme/ThemeProvider"

export default function Notacess() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const langs = localStorage.getItem("lang")

  useEffect(() => {
    if (langs) {
      i18n.changeLanguage(langs)
    }
  }, [i18n])

  useEffect(() => {
    const changeFavicon = (href: string) => {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/jpg'
      link.rel = 'icon'
      link.href = href

      document.getElementsByTagName('head')[0].appendChild(link)
    }

    changeFavicon('Logo_SM_WBG.jpg')

    return () => {
      changeFavicon('Logo_SM_WBG.jpg')
    }
  }, [])

  return (
    <AccessDenied>
      <TabLightPage $bgColor="rgba(200, 200, 0, 0.4)" $shadowColor="rgba(200, 200, 0, 0.7)" />
      <RiAlertFill size={64} color={theme.mode === 'dark' ? 'Yellow' : 'var(--main-dark-color)'} />
      <h1>{t('titleNotAccess')}</h1>
      <p>{t('descriptionNotAccess')}</p>
      <p>
        <i onClick={() => navigate(-1)}>{t('buttonErrorBack')}</i>
      </p>
    </AccessDenied>
  )
}