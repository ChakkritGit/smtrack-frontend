import { Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import Hospitals from '../../pages/setting/hospitals/hospitals'
import Adddevices from "./devices/managedev"
import AdjustLog from "./adjustlog/adjust.log"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { items } from "../../animation/animate"
import { useEffect, useState } from "react"
import { cookieOptions, cookies } from "../../constants/constants"
import { MainTab, MainTabManageContainer } from "../../style/components/manage.dev"

export default function Setting() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [selectedTab, setSelectedTab] = useState<string>(cookies.get('selectTab') ?? 'setting')

  const saveSelectTab = (keyValue: string) => {
    setSelectedTab(keyValue)
    cookies.set('selectTab', keyValue, cookieOptions)
  }

  useEffect(() => {
    if (id === "logadjust") {
      setSelectedTab(id)
    }
  }, [id])

  return (
    <Container fluid>
      <motion.div
        variants={items}
        initial="hidden"
        animate="visible"
      >
        <MainTabManageContainer>
          <MainTab
            onClick={() => saveSelectTab('setting')}
            $primary={selectedTab === 'setting'}
          >
            {t('tabManageDevice')}
          </MainTab>
          <MainTab
            onClick={() => saveSelectTab('hospital')}
            $primary={selectedTab === 'hospital'}
          >
            {t('tabManageHospitals')}
          </MainTab>
          <MainTab
            onClick={() => saveSelectTab('logadjust')}
            $primary={selectedTab === 'logadjust'}
          >
            {t('tabAdjustHistory')}
          </MainTab>
        </MainTabManageContainer>

        {
          selectedTab === 'setting' ?
            <Adddevices /> :
            selectedTab === 'hospital' ?
              <Hospitals /> :
              <AdjustLog />
        }
      </motion.div>
    </Container>
  )
}
