import { RiAndroidLine } from "react-icons/ri"
import { DowmloadFlex } from "../../style/components/manage.dev"

function DownloadApp() {
  return (
    <DowmloadFlex>
      <div>
        <RiAndroidLine size={24} />
        <span>Android</span>
      </div>
      <a href="https://api.siamatic.co.th/etemp/media/app-release.apk" rel="noopener noreferrer">Download</a>
    </DowmloadFlex>
  )
}

export default DownloadApp