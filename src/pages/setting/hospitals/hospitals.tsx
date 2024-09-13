import { useTranslation } from "react-i18next"
import ManageHospitals from "./manageHospitals"
import { MainTab, MainTabManageContainer } from "../../../style/components/manage.dev"
import { cookieOptions, cookies } from "../../../constants/constants"
import { useState } from "react"

export default function Hospitals() {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState<string>(cookies.get('selectTabHos') ?? 'hospital')

  const saveSelectTab = (keyValue: string) => {
    setSelectedTab(keyValue)
    cookies.set('selectTabHos', keyValue, cookieOptions)
  }

  return (
    <>
      <MainTabManageContainer>
        <MainTab
          onClick={() => saveSelectTab('hospital')}
          $primary={selectedTab === 'hospital'}
        >
          {t('subTabHosandWard')}
        </MainTab>
      </MainTabManageContainer>

      {
        selectedTab === 'hospital' && <ManageHospitals />
      }
    </>
  )
}
