// import { useEffect } from "react"
// import { UAParser } from "ua-parser-js"
import playStore from '../../assets/images/playstore.png'
import appStore from '../../assets/images/appstore.png'
import LogoBanner from '../../assets/images/app-logo.png'
import ApkBanner from '../../assets/images/apk-banner.svg'
import { useTranslation } from "react-i18next"
import { AppContainer, StoreBanner, StoreContainer } from "../../style/components/login"
import pdf from "../../assets/pdf/install_apk.pdf"

const Application = () => {
  const { t } = useTranslation()

  // useEffect(() => {
  //   const parser = new UAParser()
  //   const os = parser.getOS().name

  //   let redirectUrl = ""
  //   if (os === "Android") {
  //     redirectUrl = "https://play.google.com/store/apps/details?id=YOUR_ANDROID_APP_ID"
  //   } else if (os === "iOS") {
  //     redirectUrl = "https://apps.apple.com/th/app/smtrack/id6670781090"
  //   } else {
  //     redirectUrl = "https://api.siamatic.co.th/etemp/media/app-release.apk"
  //   }

  //   window.location.href = redirectUrl
  // }, [])

  return (
    <AppContainer>
      <StoreContainer>
        <div>
          <img src={LogoBanner} alt="Logo-banner" />
        </div>
        <div></div>
        <div>
          <span>{t('appDownload')} SMTrack+</span>
          <div>
            <a href="https://apps.apple.com/th/app/smtrack/id6670781090" target="_blank" rel="noopener noreferrer">
              <StoreBanner src={appStore} alt="app-store" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.thanes.temp_noti" target="_blank" rel="noopener noreferrer">
              <StoreBanner src={playStore} alt="play-store" />
            </a>
            <a href="https://api.siamatic.co.th/etemp/media/app-release.apk" target="_blank" rel="noopener noreferrer">
              <StoreBanner src={ApkBanner} alt="play-store" />
            </a>
          </div>
        </div>
      </StoreContainer>
      <a onClick={() => window.open(pdf)}>{t('installApp')}</a>
    </AppContainer>
  )
}

export default Application