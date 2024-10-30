import { useTranslation } from 'react-i18next'
import Managedev from './managedevices'
import Probesetting from './probesetting'
import Uploadfirmware from './uploadfirmware'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { cookieOptions, cookies } from '../../../constants/constants'
import { MainTab, MainTabManageContainer } from '../../../style/components/manage.dev'
import { RootState } from '../../../stores/store'

export default function Adddevices() {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { userLevel } = cookieDecode
  const [selectedTab, setSelectedTab] = useState<string>(cookies.get('selectTabSub') ?? 'device')

  const saveSelectTab = (keyValue: string) => {
    setSelectedTab(keyValue)
    cookies.set('selectTabSub', keyValue, cookieOptions)
  }

  return (
    <>
      <MainTabManageContainer>
        <MainTab
          onClick={() => saveSelectTab('device')}
          $primary={selectedTab === 'device'}
        >
          {t('subTabDevice')}
        </MainTab>
        {
          userLevel !== '3' && <MainTab
            onClick={() => saveSelectTab('probe')}
            $primary={selectedTab === 'probe'}
          >
            {t('subTabProbe')}
          </MainTab>
        }
        {
          userLevel === '0' && <MainTab
            onClick={() => saveSelectTab('firmware')}
            $primary={selectedTab === 'firmware'}
          >
            {t('subTabFirmware')}
          </MainTab>
        }
      </MainTabManageContainer>

      {
        selectedTab === 'device' ?
          <Managedev /> :
          selectedTab === 'probe' ?
            userLevel !== '3' ?
              <Probesetting /> :
              <></> :
            userLevel === '0' ?
              <Uploadfirmware />
              :
              <></>
      }
    </>
  )
}
