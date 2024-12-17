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
  const { log } = devicesData

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
          svg={Number(log[0]?.tempValue.toFixed(2)) >= devicesData?.maxTemp || Number(log[0]?.tempValue.toFixed(2)) <= devicesData?.minTemp ? <RiErrorWarningLine />
            :
            <RiTempColdLine />}
          valuesone={`Temp: ${Number(log[0]?.tempValue.toFixed(2)) <= devicesData?.minTemp ? '↓' : Number(log[0]?.tempValue.toFixed(2)) >= devicesData?.maxTemp ? '↑' : ''} ${log[0]?.tempValue ? log[0]?.tempValue.toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'%RH'}
          alertone={Number(log[0]?.tempValue.toFixed(2)) === 0 || Number(log[0]?.tempValue.toFixed(2)) >= devicesData?.maxTemp || Number(log[0]?.tempValue.toFixed(2)) <= devicesData?.minTemp}
        />
        <CardstatusNomal
          title={t('dashConnect')}
          valuestext={
            log[0]?.internet ? t('stateDisconnect') : t('stateConnect')}
          svg={<RiSignalWifi1Line />}
          alertone={log[0]?.internet}
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashDoor')}
          valuestext={
            log[0]?.door ? t('doorOpen') : t('doorClose')}
          svg={log[0]?.door ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          alertone={
            log[0]?.door
          }
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashPlug')}
          valuestext={
            log[0]?.plugin ? t('stateProblem') : t('stateNormal')
          }
          svg={<RiPlugLine />}
          alertone={log[0]?.plugin}
          onClick={() => { }}
        />
        {/* <CardstatusNomal
          title={t('dashBattery')}
          valuestext={
            `${devicesData?.log[0]?.battery ? devicesData?.log[0]?.battery : '- -'} %`
          }
          svg={devicesData?.log[0]?.ac === '0' ?
            <RiBatteryChargeLine />
            :
            devicesData?.log[0]?.battery === 0 ?
              <RiBatteryLine />
              :
              devicesData?.log[0]?.battery <= 50 ?
                <RiBatteryLowLine />
                :
                devicesData?.log[0]?.battery <= 100 ?
                  <RiBatteryFill />
                  :
                  <RiAlertLine />}
          alertone={devicesData?.log[0]?.battery === 0 || devicesData?.log[0]?.battery === undefined}
          onClick={() => { }}
        /> */}
        <CardstatusSpecial
          title={t('dashTempofDay')}
          svg={<HiOutlineArrowsUpDown />}
          valuesone={`↑ ${log.length > 0 ? Number(Math.max(...(log.map((items) => items.tempValue)))).toFixed(2) : '- -'}`}
          valuestwo={`↓ ${log.length > 0 ? Number(Math.min(...(log.map((items) => items.tempValue)))).toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'°C'}
        />
        {/* <CardstatusNomal
          title={t('dashSdCard')}
          valuestext={
            devicesData?.log[0]?.sdCard === '0' ? t('stateNormal') : t('stateProblem')
          }
          svg={devicesData?.log[0]?.sdCard === "1" ?
            <MdOutlineSdCardAlert />
            :
            <MdOutlineSdCard />}
          alertone={devicesData?.log[0]?.sdCard !== '0'}
          onClick={onShowDetail}
          showSdDetail={showSdDetail}
          devObj={{
            devSerial: devSerial,
            deviceModel: deviceModel,
            version: version
          }}
        /> */}
        {/* <CardstatusSpecial
          title={t('dashProbeandDoor')}
          svg={<RiCollageLine />}
          valuesone={`${devicesData?.probe.length} P.`}
          valuestwo={`${devicesData?.probe[0]?.door} D.`}
          pipetwo={''}
        /> */}
        {/* <CardstatusNomal
          title={t('dashWarranty')}
          svg={<RiShieldCheckLine />}
          valuestext={
            warranty[0]?.expire ?
              dataData.daysRemaining > 0
                ? dataData.years > 0
                  ? `${dataData.years} ${t('year')} ${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                  : dataData.months > 0
                    ? `${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                    : `${dataData.remainingDays} ${t('day')}`
                : t('tabWarrantyExpired')
              : t('notRegistered')
          }
          alertone={Math.ceil((new Date(dateInstall ?? devicesData?.dateInstall).setFullYear(new Date(devicesData ? devicesData?.dateInstall : '2024-01-01').getFullYear() + 1) - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0}
          pathName="/warranty"
          onClick={() => { }}
        /> */}
        {/* <CardstatusNomal
          title={t('dashRepair')}
          valuestext={
            '- -'
          }
          svg={<RiFolderSettingsLine />}
          pathName="/repair"
          onClick={() => { }}
        /> */}
      </DevicesBodyStatus>
    </DashboardDevicesInfo>
  )
}

export default TmsDeviceInfo