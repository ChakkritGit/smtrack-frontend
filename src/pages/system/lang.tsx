import { useTranslation } from "react-i18next"
import LangguageSelector from "../../components/lang/LangguageSelector"

export default function Lang() {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('tabLanguage')}</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <span>{t('changeLanguage')}</span>
        <LangguageSelector />
      </div>
    </div>
  )
}
