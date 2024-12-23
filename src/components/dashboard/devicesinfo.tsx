import {
  RiAlarmWarningFill,
  RiAlertLine,
  RiBatteryChargeLine,
  RiBatteryFill,
  RiBatteryLine,
  RiBatteryLowLine,
  RiBellFill,
  RiCloseLine, RiCollageLine, RiDoorClosedLine, RiDoorOpenLine, RiErrorWarningLine, RiFolderSettingsLine,
  RiPlugLine, RiSettings3Line, RiShieldCheckLine,
  RiSignalWifi1Line, RiTempColdLine
} from "react-icons/ri"
import {
  CardDevBtn,
  DashboardDevicesDetails, DashboardDevicesInfo,
  DeviceDetailsBody, DeviceDetailsBodyInfo, DeviceDetailsBodyimg,
  DeviceDetailsHead, DevicesBodyStatus, ExpandPicture, FormBtn,
  FormFlexBtn, LineHr, ModalHead, SpanCardDash, TooltipSpanLeft
} from "../../style/style"
import { dateCalType, devicesType } from "../../types/device.type"
import { CardstatusNomal, CardstatusSpecial } from "./cardstatus"
import { FormEvent, useEffect, useState } from "react"
import { Form, Modal, Row } from "react-bootstrap"
import { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { client } from "../../services/mqtt"
import { responseType } from "../../types/response.type"
import { probeType } from "../../types/probe.type"
import { useDispatch } from "react-redux"
import { setRefetchdata, setShowAlert } from "../../stores/utilsStateSlice"
import { storeDispatchType } from "../../stores/store"
import { fetchDevicesLog } from "../../stores/LogsSlice"
import Adjustment from "../adjustments/adjustment"
import ModalNotification from "../home/modal.noti"
import ModalMute from "../home/modal.mute"
import { filtersDevices } from "../../stores/dataArraySlices"
import { MuteFlex, OpenSettingBuzzer } from "../../style/components/home.styled"
import { calulateDate, ImageComponent } from "../../constants/constants"
import { HiOutlineArrowsUpDown } from "react-icons/hi2"
import { MdOutlineSdCard, MdOutlineSdCardAlert } from "react-icons/md"
import axiosInstance from "../../constants/axiosInstance"

type Devicesinfo = {
  devicesData: devicesType,
  index: number
}

export default function Devicesinfo(deviceInfo: Devicesinfo) {
  const { devicesData } = deviceInfo
  const dispatch = useDispatch<storeDispatchType>()
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [showPic, setShowpic] = useState(false)
  const { probe, devSerial } = devicesData
  const [formdata, setFormdata] = useState({
    adjustTemp: probe[0]?.adjustTemp,
    adjustHum: probe[0]?.adjustHum
  })
  const [tempvalue, setTempvalue] = useState<number[]>([probe[0]?.tempMin, probe[0]?.tempMax])
  const [humvalue, setHumvalue] = useState<number[]>([probe[0]?.humMin, probe[0]?.humMax])
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const [dataData, setDateData] = useState<dateCalType>({} as dateCalType)
  const [showSetting, setShowSetting] = useState(false)
  const [showSettingMute, setShowSettingMute] = useState(false)
  const deviceModel = devSerial.substring(0, 3) === "eTP" ? "smtrack" : "items"
  const version = devSerial.substring(3, 5).toLowerCase()
  const [showSdDetail, setShowSdDetail] = useState(false)

  const handlsmtrackChange = (_event: Event, newValue: number | number[]) => {
    setTempvalue(newValue as number[])
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setHumvalue(newValue as number[])
  }

  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustTemp: newValue as number })
  }

  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjustHum: newValue as number })
  }

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    if (deviceModel === 'smtrack') {
      client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/temp`, 'off')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/temp`, 'off')
    }
    client.publish(`${devicesData.devSerial}/temp`, 'off')
    setShow(false)
  }

  const openPicmodal = () => {
    setShowpic(true)
  }

  const closePicmodal = () => {
    setShowpic(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/probe/${devicesData?.probe[0]?.probeId}`
    if (Number((mqttData.humi + formdata.adjustHum - devicesData.probe[0]?.adjustHum).toFixed(2)) > 100.00 || Number((mqttData.humi + formdata.adjustHum - devicesData.probe[0]?.adjustHum).toFixed(2)) < -100) {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('adjustHumGreater'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
      return
    }

    try {
      const response = await axiosInstance.put<responseType<probeType>>(url, {
        tempMin: tempvalue[0],
        tempMax: tempvalue[1],
        humMin: humvalue[0],
        humMax: humvalue[1],
        adjustTemp: formdata.adjustTemp,
        adjustHum: formdata.adjustHum,
      })
      if (deviceModel === 'smtrack') {
        client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/adj`, 'on')
      } else {
        client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/adj`, 'on')
      }
      client.publish(`${devicesData.devSerial}/adj`, 'on')
      setShow(false)
      dispatch(fetchDevicesLog({ deviceId: devicesData.devId }))
      dispatch(setRefetchdata(true))
      Swal.fire({
        title: t('alertHeaderSuccess'),
        text: response.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: error.response?.data.message,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } else {
        Swal.fire({
          title: t('alertHeaderError'),
          text: 'Uknown Error',
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    }
  }

  useEffect(() => {
    if (show) {
      client.subscribe(`${devicesData.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      if (deviceModel === 'smtrack') {
        client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/temp`, 'on')
      } else {
        client.publish(`siamatic/${deviceModel}/${version}/${devicesData.devSerial}/temp`, 'on')
      }
      client.publish(`${devicesData.devSerial}/temp`, 'on')

      client.on('message', (_topic, message) => {
        setMqttData(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [show])

  useEffect(() => {
    setDateData(calulateDate(devicesData))
  }, [devicesData])

  useEffect(() => {
    if (show) {
      setFormdata({
        adjustTemp: probe[0]?.adjustTemp,
        adjustHum: probe[0]?.adjustHum
      })
      setTempvalue([probe[0]?.tempMin, probe[0]?.tempMax])
      setHumvalue([probe[0]?.humMin, probe[0]?.humMax])
    }
  }, [show])

  const openSettingMute = () => {
    setShowSettingMute(true)
  }

  const openSetting = () => {
    setShowSetting(true)
  }

  const onShowDetail = () => {
    setShowSdDetail(!showSdDetail)
  }

  return (
    <DashboardDevicesInfo>
      <DashboardDevicesDetails>
        <DeviceDetailsHead>
          <div>
            <SpanCardDash>
              <b>{t('deviceNameBox')}</b>
              <span>•</span>
              <span>{devicesData?.devDetail && devicesData?.devDetail !== null && devicesData?.devDetail !== "null" ? devicesData?.devDetail : '- -'}</span>
            </SpanCardDash>
            <SpanCardDash>
              <b>{t('deviceSnBox')}</b>
              <span>•</span>
              <span>{devicesData?.devSerial}</span>
            </SpanCardDash>
          </div>
          <CardDevBtn onClick={openmodal}>
            <RiSettings3Line />
            <TooltipSpanLeft>
              {t('deviceToolAdjust')}
            </TooltipSpanLeft>
          </CardDevBtn>
        </DeviceDetailsHead>
        <DeviceDetailsBody>
          <DeviceDetailsBodyimg onClick={openPicmodal}>
            <ImageComponent
              src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
              alt="device_pic" />
          </DeviceDetailsBodyimg>
          <DeviceDetailsBodyInfo>
            <div>
              <li><b title={devicesData?.locInstall && devicesData?.locInstall !== null && devicesData?.locInstall !== "null" ? devicesData?.locInstall : '- -'}>{devicesData?.locInstall && devicesData?.locInstall !== null && devicesData?.locInstall !== "null" ? devicesData?.locInstall : '- -'}</b></li>
              <li><b>{t('tempValueUnit')}</b>: {probe[0]?.tempMin} - {probe[0]?.tempMax} °C</li>
              <li><b>{t('humValueUnit')}</b>: {probe[0]?.humMin} - {probe[0]?.humMax} %RH</li>
              <li><b>{t('ipAddress')}</b>: {devicesData?.config?.ip ? devicesData?.config?.ip : '- -'}</li>
              <li><b>{t('macAddress')}</b>: {devicesData?.config?.macAddWiFi ? devicesData?.config?.macAddWiFi : '- -'}</li>
              <li><b>{t('firmWareVer')}</b>: {devicesData?.firmwareVersion ? devicesData?.firmwareVersion : '- -'}</li>
            </div>
          </DeviceDetailsBodyInfo>
        </DeviceDetailsBody>
      </DashboardDevicesDetails>
      <DevicesBodyStatus>
        <CardstatusSpecial
          title={t('dashProbe')}
          svg={Number(devicesData?.log[0]?.tempAvg.toFixed(2)) >= probe[0]?.tempMax || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) <= probe[0]?.tempMin ? <RiErrorWarningLine />
            :
            <RiTempColdLine />}
          valuesone={`Temp: ${Number(devicesData?.log[0]?.tempAvg.toFixed(2)) <= probe[0]?.tempMin ? '↓' : Number(devicesData?.log[0]?.tempAvg.toFixed(2)) >= probe[0]?.tempMax ? '↑' : ''} ${devicesData?.log[0]?.tempAvg ? devicesData?.log[0]?.tempAvg.toFixed(2) : '- -'}`}
          valuestwo={`Hum: ${devicesData?.log[0]?.humidityAvg ? devicesData?.log[0]?.humidityAvg.toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'%RH'}
          alertone={Number(devicesData?.log[0]?.tempAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) >= probe[0]?.tempMax || Number(devicesData?.log[0]?.tempAvg.toFixed(2)) <= probe[0]?.tempMin}
          alerttwo={Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) === 0 || Number(devicesData?.log[0]?.humidityAvg.toFixed(2)) >= probe[0]?.humMax || Number(Number(devicesData?.log[0]?.humidityAvg.toFixed(2))) <= probe[0]?.humMin}
        />
        <CardstatusNomal
          title={t('dashConnect')}
          valuestext={
            devicesData.backupStatus === '0' ? t('stateDisconnect') : t('stateConnect')}
          svg={<RiSignalWifi1Line />}
          alertone={devicesData.backupStatus === '0'}
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashDoor')}
          valuestext={
            devicesData?.log[0]?.door1 === '1' ||
              devicesData?.log[0]?.door2 === '1' ||
              devicesData?.log[0]?.door3 === '1' ? t('doorOpen') : t('doorClose')}
          svg={devicesData?.log[0]?.door1 === '1' ||
            devicesData?.log[0]?.door2 === '1' ||
            devicesData?.log[0]?.door3 === '1' ? <RiDoorOpenLine /> : <RiDoorClosedLine />}
          alertone={
            devicesData?.log[0]?.door1 === '1' ||
            devicesData?.log[0]?.door2 === '1' ||
            devicesData?.log[0]?.door3 === '1'
          }
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashPlug')}
          valuestext={
            devicesData?.log[0]?.ac !== '1' ? t('stateNormal') : t('stateProblem')
          }
          svg={<RiPlugLine />}
          alertone={devicesData?.log[0]?.ac === '1'}
          onClick={() => { }}
        />
        <CardstatusNomal
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
        />
        <CardstatusSpecial
          title={t('dashTempofDay')}
          svg={<HiOutlineArrowsUpDown />}
          valuesone={`↑ ${devicesData?.log.length > 0 ? Number(Math.max(...(devicesData?.log.map((items) => items.tempAvg)))).toFixed(2) : '- -'}`}
          valuestwo={`↓ ${devicesData?.log.length > 0 ? Number(Math.min(...(devicesData?.log.map((items) => items.tempAvg)))).toFixed(2) : '- -'}`}
          pipeone={'°C'}
          pipetwo={'°C'}
        />
        <CardstatusNomal
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
            devSerial: devicesData.devSerial,
            deviceModel: deviceModel,
            version: version
          }}
        />
        <CardstatusSpecial
          title={t('dashProbeandDoor')}
          svg={<RiCollageLine />}
          valuesone={`${devicesData?.probe.length} P.`}
          valuestwo={`${devicesData?.probe[0]?.door} D.`}
          pipetwo={''}
        />
        <CardstatusNomal
          title={t('dashWarranty')}
          svg={<RiShieldCheckLine />}
          valuestext={
            devicesData.warranty[0]?.expire ?
              dataData.daysRemaining > 0
                ? dataData.years > 0
                  ? `${dataData.years} ${t('year')} ${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                  : dataData.months > 0
                    ? `${dataData.months} ${t('month')} ${dataData.remainingDays} ${t('day')}`
                    : `${dataData.remainingDays} ${t('day')}`
                : t('tabWarrantyExpired')
              : t('notRegistered')
          }
          alertone={Math.ceil((new Date(devicesData.dateInstall ?? devicesData?.dateInstall).setFullYear(new Date(devicesData ? devicesData?.dateInstall : '2024-01-01').getFullYear() + 1) - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 0}
          pathName="/warranty"
          onClick={() => { }}
        />
        <CardstatusNomal
          title={t('dashRepair')}
          valuestext={
            '- -'
          }
          svg={<RiFolderSettingsLine />}
          pathName="/repair"
          onClick={() => { }}
        />
      </DevicesBodyStatus>

      <Modal size="lg" show={show} onHide={closemodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Adjustment
                devicesdata={devicesData}
                formData={formdata}
                handleAdjusthumChange={handleAdjusthumChange}
                handleAdjusttempChange={handleAdjusttempChange}
                handleHumChange={handleHumChange}
                handlsmtrackChange={handlsmtrackChange}
                humvalue={humvalue}
                mqttData={mqttData}
                setFormData={setFormdata}
                setHumvalue={setHumvalue}
                setTempvalue={setTempvalue}
                tempvalue={tempvalue}
                showAdjust={true}
              />
              <Form.Label className="w-100 form-label">
                <span><b>{t('muteSetting')}</b></span>
                <LineHr />
              </Form.Label>
              <MuteFlex>
                <OpenSettingBuzzer type="button" onClick={() => { openSetting(); closemodal(); }}>
                  <RiAlarmWarningFill size={24} />
                  <span>{t('notificationSettings')}</span>
                </OpenSettingBuzzer>
                <OpenSettingBuzzer type="button" onClick={() => { openSettingMute(); closemodal(); }}>
                  <RiBellFill size={24} />
                  <span>{t('muteSettings')}</span>
                </OpenSettingBuzzer>
              </MuteFlex>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('saveButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal size="xl" show={showPic} onHide={closePicmodal}>
        <Modal.Header>
          {/* <pre style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(formdata)}
          </pre> */}
          <ModalHead>
            <strong>
              {devicesData?.devSerial}
            </strong>
            <button onClick={closePicmodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <ExpandPicture>
              <ImageComponent
                src={devicesData?.locPic ? `${import.meta.env.VITE_APP_IMG}${devicesData?.locPic}` : `${import.meta.env.VITE_APP_IMG}/img/default-pic.png`}
                alt="device_pic"
              />
            </ExpandPicture>
          </Modal.Body>
        </Form>
      </Modal>

      {
        showSetting && devicesData && <ModalNotification
          key={devicesData.devId}
          devicesdata={devicesData}
          fetchData={filtersDevices}
          setShow={setShow}
          showSetting={showSetting}
          setShowSetting={setShowSetting}
        />
      }
      {
        showSettingMute && devicesData && <ModalMute
          key={devicesData.devId}
          devicesdata={devicesData}
          setShow={setShow}
          showSettingMute={showSettingMute}
          setShowSettingMute={setShowSettingMute}
        />
      }
    </DashboardDevicesInfo>
  )
}
