import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import th from './lang_pack/th'
import en from './lang_pack/en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      th: th,
      en: en
    },
    lng: 'th',
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
