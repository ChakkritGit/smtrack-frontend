import { DowmloadFlex } from "../../style/components/manage.dev"
import AppLogo from '../../assets/images/app-logo.png'
import { useState } from "react"
import { useTranslation } from "react-i18next"

function DownloadApp() {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpandText = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <DowmloadFlex $isExpand={isExpanded}>
      <div>
        <div>
          <img src={AppLogo} alt="App-Logo" />
          <div>
            <span>SMTrack+</span>
            <span>
              โปรแกรมสำหรับดูค่าอุณหภูมิ/ความชื้นปัจจุบัน ของตู้แช่ แบบ Real-Time รวมถึงแจ้งเตือนหากเกินค่า Min/Max ที่กำหนดใช้ร่วมกับเครื่องติดตามอุณหภูมิตู้แช่ รุ่น smtrack/i-TEMS
            </span>
            <a onClick={toggleExpandText}>
              {isExpanded ? t('isCollapseText') : t('isExapndText')}
            </a>
          </div>
        </div>
      </div>
      <a
        href="https://api.siamatic.co.th/smtrack/media/app-release.apk"
        rel="noopener noreferrer">{t('appDownload')}</a>
    </DowmloadFlex>
  )
}

export default DownloadApp