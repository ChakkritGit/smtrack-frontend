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
  const { tokenDecode } = useSelector((state: RootState) => state.utilsState)
  const { role } = tokenDecode
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
          role !== 'USER' && <MainTab
            onClick={() => saveSelectTab('probe')}
            $primary={selectedTab === 'probe'}
          >
            {t('subTabProbe')}
          </MainTab>
        }
        {
          role === 'SUPER' && <MainTab
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
            role !== 'USER' ?
              <Probesetting /> :
              <></> :
            role === 'SUPER' ?
              <Uploadfirmware />
              :
              <></>
      }
    </>
  )
}
