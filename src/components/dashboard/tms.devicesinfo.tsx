import { useTranslation } from "react-i18next"
import {
  DashboardDevicesDetails, DashboardDevicesInfo, DeviceDetailsBody, DeviceDetailsBodyimg,
  DeviceDetailsBodyInfo, DeviceDetailsHead, DevicesBodyStatus, SpanCardDash
} from "../../style/style"
import { TmsDeviceType } from "../../types/tms.type"
import {
  RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine, RiPlugLine,
  RiSignalWifi1Line, RiTempColdLine
} from "react-icons/ri"
import { ImageComponent } from "../../constants/constants"
import { CardstatusNomal, CardstatusSpecial } from "./cardstatus"
import { HiOutlineArrowsUpDown } from "react-icons/hi2"
import DefaultPic from "../../assets/images/default-pic.png"

type Devicesinfo = {
  devicesData: TmsDeviceType
}

const TmsDeviceInfo = (deviceInfo: Devicesinfo) => {
  const { t } = useTranslation()
  const { devicesData } = deviceInfo

  return (
    <DashboardDevicesInfo>
      <DashboardDevicesDetails>
        <DeviceDetailsHead>
          <div>
            <SpanCardDash>
              <b>{t('deviceNameBox')}</b>
              <span>•</span>
              <span>{devicesData?.name && devicesData?.name !== null && devicesData?.name !== "null" ? devicesData?.name : '- -'}</span>
            </SpanCardDash>
            <SpanCardDash>
              <b>{t('deviceSnBox')}</b>
              <span>•</span>
              <span>{devicesData?.sn}</span>
            </SpanCardDash>
          </div>
        </DeviceDetailsHead>
        <DeviceDetailsBody>
          <DeviceDetailsBodyimg $primary>
            <ImageComponent
              src={DefaultPic}
              alt="device_pic" />
          </DeviceDetailsBodyimg>
          <DeviceDetailsBodyInfo>
            <div>
              <li><b title={devicesData?.ward && devicesData?.ward !== null && devicesData?.ward !== "null" ? devicesData?.ward : '- -'}>{devicesData?.ward && devicesData?.ward !== null && devicesData?.ward !== "null" ? devicesData?.ward : '- -'}</b></li>
              <li><b>{t('tempValueUnit')}</b>: {devicesData?.minTemp} - {devicesData?.maxTemp} °C</li>
            </div>
          </DeviceDetailsBodyInfo>
        </DeviceDetailsBody>
      </DashboardDevicesDetails>
      <DevicesBodyStatus>
        <CardstatusSpecial
          title={t('dashProbe')}
          svg={Number(devicesData.log[0]?.tempValue?.toFixed(2)) >= devicesData?.maxTemp || Number(devicesData.log[0]?.tempValue?.toFixed(2)) <= devicesData?.minTemp ? <RiErrorWarningLine />
            :
            <RiTempColdLine />}
          valuesone={`Temp: ${Number(devicesData.log[0]?.tempValue.toFixed(2)) <= devicesData?.minTemp ? '↓' : Number(devicesData.log[0]?.tempValue.toFixed(2)) >= devicesData?.maxTemp ? '↑' : ''} ${devicesData.log[0]?.tempValue ? devicesData.log[0]?.tempValue.toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'%RH'}
          alertone={Number(devicesData.log[0]?.tempValue.toFixed(2)) === 0 || Number(devicesData.log[0]?.tempValue.toFixed(2)) >= devicesData?.maxTemp || Number(devicesData.log[0]?.tempValue.toFixed(2)) <= devicesData?.minTemp}
        />
        <CardstatusNomal
          title={t('dashConnect')}
          valuestext={
            devicesData.log[0]?.internet ? t('stateConnect') : t('stateDisconnect')}
          svg={<RiSignalWifi1Line />}
          alertone={!devicesData.log[0]?.internet}
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashDoor')}
          valuestext={
            devicesData.log[0]?.door ? t('doorOpen') : t('doorClose')}
          svg={devicesData.log[0]?.door ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          alertone={
            devicesData.log[0]?.door
          }
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashPlug')}
          valuestext={
            devicesData.log[0]?.plugin ? t('stateProblem') : t('stateNormal')
          }
          svg={<RiPlugLine />}
          alertone={devicesData.log[0]?.plugin}
          onClick={() => { }}
        />
        <CardstatusSpecial
          title={t('dashTempofDay')}
          svg={<HiOutlineArrowsUpDown />}
          valuesone={`↑ ${devicesData.log.length > 0 ? Number(Math.max(...(devicesData.log.map((items) => items.tempValue)))).toFixed(2) : '- -'}`}
          valuestwo={`↓ ${devicesData.log.length > 0 ? Number(Math.min(...(devicesData.log.map((items) => items.tempValue)))).toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'°C'}
        />
      </DevicesBodyStatus>
    </DashboardDevicesInfo>
  )
}

export default TmsDeviceInfo