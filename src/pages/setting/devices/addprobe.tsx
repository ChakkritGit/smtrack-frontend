import { useTranslation } from "react-i18next"
import { ManageProbeAdd } from "../../../style/components/manage.probe"
import { addprobeProps } from "../../../types/prop.type"
import { RiAddLine, RiArrowDownLine, RiArrowRightLine, RiCloseLine, RiEditLine } from "react-icons/ri"
import { FormEvent, useEffect, useState } from "react"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap"
import { FormBtn, FormFlexBtn, FormSliderRange, ModalHead, RangeInputText, SliderFlex, SliderLabelFlex, SliderRangeFlex } from "../../../style/style"
import { Slider } from "@mui/material"
import { DeviceState, DeviceStateStore, UtilsStateStore } from "../../../types/redux.type"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import axios, { AxiosError } from "axios"
import { responseType } from "../../../types/response.type"
import { probeType } from "../../../types/probe.type"
import { storeDispatchType } from "../../../stores/store"
import { fetchProbeData } from "../../../stores/probeSlice"
import { client } from "../../../services/mqtt"
import { AdjustRealTimeFlex } from "../../../style/components/home.styled"
import { setShowAlert } from "../../../stores/utilsStateSlice"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../../theme/ThemeProvider"

type Option = {
  value: string,
  label: string,
}

type Probe = {
  devSerial: string
}

type OptionData = {
  value: string,
  name: string
}

export default function Addprobe(addprobe: addprobeProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const { pagestate, probeData } = addprobe
  const { devices } = useSelector<DeviceStateStore, DeviceState>((state) => state.devices)
  const { cookieDecode } = useSelector<DeviceStateStore, UtilsStateStore>((state) => state.utilsState)
  const { token } = cookieDecode
  const [show, setShow] = useState(false)
  const [formdata, setFormdata] = useState({
    probeName: pagestate !== "add" ? probeData?.probeName : '',
    probeType: pagestate !== "add" ? probeData?.probeType : '',
    probeCh: pagestate !== "add" ? probeData?.probeCh : '',
    devSerial: pagestate !== "add" ? probeData?.devSerial : '',
    adjust_temp: pagestate !== "add" ? probeData?.adjustTemp : '',
    adjust_hum: pagestate !== "add" ? probeData?.adjustHum : '',
    delay_time: pagestate !== "add" ? probeData?.delayTime : '',
    door: pagestate !== "add" ? probeData?.door : '',
    location: pagestate !== "add" ? probeData?.location : '',
    tempvalue: [pagestate !== "add" ? Number(probeData?.tempMin) : 0, pagestate !== "add" ? Number(probeData?.tempMax) : 0],
    humvalue: [pagestate !== "add" ? Number(probeData?.humMin) : 0, pagestate !== "add" ? Number(probeData?.humMax) : 0]
  })
  const [mqttData, setMqttData] = useState({ temp: 0, humi: 0 })
  const { theme } = useTheme()

  const openmodal = () => {
    setShow(true)
  }

  const closemodal = () => {
    const deviceModel = probeData?.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
    if (deviceModel === 'eTEMP') {
      client.publish(`siamatic/etemp/v1/${probeData?.device.devSerial}/temp`, 'off')
    } else {
      client.publish(`siamatic/items/v3/${probeData?.device.devSerial}/temp`, 'off')
    }
    client.publish(`${probeData?.devSerial}/temp`, 'off')
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const url: string = `${import.meta.env.VITE_APP_API}/probe`
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devSerial: formdata.devSerial,
      adjustTemp: formdata.adjust_temp,
      adjustHum: formdata.adjust_hum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devSerial !== '' && formdata.adjust_temp !== '' && formdata.adjust_hum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== '' && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.post<responseType<probeType>>(url, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setFormdata({ ...formdata, tempvalue: [0, 0] })
        closemodal()
        dispatch(fetchProbeData(token))
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleSubmitedit = async (e: FormEvent) => {
    e.preventDefault()
    const bodyData = {
      probeName: formdata.probeName,
      probeType: formdata.probeType,
      probeCh: formdata.probeCh,
      devId: formdata.devSerial,
      adjustTemp: formdata.adjust_temp,
      adjustHum: formdata.adjust_hum,
      delayTime: formdata.delay_time,
      door: Number(formdata.door),
      location: formdata.location,
      tempMin: formdata.tempvalue[0],
      tempMax: formdata.tempvalue[1],
      humMin: formdata.humvalue[0],
      humMax: formdata.humvalue[1],
    }
    if (formdata.devSerial !== '' && formdata.adjust_temp !== '' && formdata.adjust_hum !== '' && formdata.door !== '' && formdata.delay_time !== ''
      && formdata.probeName !== '' && formdata.probeType !== '' && formdata.probeCh !== '' && formdata.location !== '' && formdata.tempvalue !== null && formdata.humvalue !== null) {
      try {
        const response = await axios.put<responseType<probeType>>(`${import.meta.env.VITE_APP_API}/probe/${probeData?.probeId}`, bodyData, {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closemodal()
        dispatch(fetchProbeData(token))
        const deviceModel = probeData?.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
        if (deviceModel === 'eTEMP') {
          client.publish(`siamatic/etemp/v1/${probeData?.device.devSerial}/adj`, 'on')
        } else {
          client.publish(`siamatic/items/v3/${probeData?.device.devSerial}/adj`, 'on')
        }
        client.publish(`${probeData?.device.devSerial}/adj`, 'on')
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
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('completeField'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleTempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, tempvalue: newValue as number[] })
  }
  const handleHumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, humvalue: newValue as number[] })
  }
  const handleAdjusttempChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_temp: newValue as number })
  }
  const handleAdjusthumChange = (_event: Event, newValue: number | number[]) => {
    setFormdata({ ...formdata, adjust_hum: newValue as number })
  }

  const delayTime = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, delay_time: selectedValue })
  }
  const doorSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, door: selectedValue })
  }
  const deviceSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, devSerial: selectedValue })
  }
  const channelSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setFormdata({ ...formdata, probeCh: selectedValue })
  }

  const delayTimeArray = [
    { value: '5', name: t('probe5Minute') },
    { value: '15', name: t('probe15Minute') },
    { value: '30', name: t('probe30Minute') },
    { value: '60', name: t('probe1Hour') },
    { value: '120', name: t('probe2Hour') },
    { value: '240', name: t('probe4Hour') },
  ]

  const doorArray = [
    { value: '1', name: t('probeDoor1') },
    { value: '2', name: t('probeDoor2') },
    { value: '3', name: t('probeDoor3') },
  ]

  const channelArray = [
    { value: '1', name: t('probeChanel1') },
    { value: '2', name: t('probeChanel2') },
    { value: '3', name: t('probeChanel3') },
    { value: '4', name: t('probeChanel4') },
  ]

  useEffect(() => {
    if (show) {
      client.subscribe(`${probeData?.devSerial}/temp/real`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      const deviceModel = probeData?.devSerial.substring(0, 3) === "eTP" ? "eTEMP" : "iTEMP"
      if (deviceModel === 'eTEMP') {
        client.publish(`siamatic/etemp/v1/${probeData?.device.devSerial}/temp`, 'on')
      } else {
        client.publish(`siamatic/items/v3/${probeData?.device.devSerial}/temp`, 'on')
      }

      client.publish(`${probeData?.devSerial}/temp`, 'on')

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

  const mapOptions = <T, K extends keyof T>(data: T[], valueKey: K, labelKey: K): Option[] =>
    data.map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))

  const mapDefaultValue = <T, K extends keyof T>(data: T[], id: string, valueKey: K, labelKey: K): Option | undefined =>
    data.filter(item => item[valueKey] === id).map(item => ({
      value: item[valueKey] as unknown as string,
      label: item[labelKey] as unknown as string
    }))[0]

  return (
    <>
      {
        pagestate == 'add' ?
          <ManageProbeAdd onClick={openmodal}>
            {t('addProbe')}
            <RiAddLine />
          </ManageProbeAdd>
          :
          <ManageProbeAdd onClick={openmodal} $primary >
            <RiEditLine size={16} />
          </ManageProbeAdd>
      }
      <Modal size={"lg"} show={show} onHide={closemodal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {
                pagestate === "add" ?
                  t('addProbe')
                  :
                  t('editProbe')
              }
            </strong>
            {/* <pre>{JSON.stringify(formdata, null, 2)}</pre> */}
            <button onClick={closemodal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={pagestate === "add" ? handleSubmit : handleSubmitedit}>
          <Modal.Body>
            <Row>
              {
                pagestate === "add" ?
                  <Col lg={12}>
                    <InputGroup className="mb-3">
                      <Form.Label className="w-100">
                        {t('selectDeviceDrop')}
                        <Select
                          options={mapOptions<Probe, keyof Probe>(devices, 'devSerial', 'devSerial')}
                          defaultValue={mapDefaultValue<Probe, keyof Probe>(devices, formdata.devSerial || '0', 'devSerial', 'devSerial')}
                          onChange={deviceSelected}
                          autoFocus={false}
                          placeholder={t('selectDeviceDrop')}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                              borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                              boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                              borderRadius: "var(--border-radius-big)"
                            }),
                          }}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary50: 'var(--main-color-opacity2)',
                              primary25: 'var(--main-color-opacity2)',
                              primary: 'var(--main-color)',
                            },
                          })}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </Form.Label>
                    </InputGroup>
                  </Col>
                  :
                  <></>
              }
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeName')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeName}
                      onChange={(e) => setFormdata({ ...formdata, probeName: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeType')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.probeType}
                      onChange={(e) => setFormdata({ ...formdata, probeType: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeLocation')}
                    <Form.Control
                      name='form_label_hosaddress'
                      spellCheck={false}
                      autoComplete='off'
                      type='text'
                      value={formdata.location}
                      onChange={(e) => setFormdata({ ...formdata, location: e.target.value })}
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('delay')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(delayTimeArray, 'value', 'name')}
                      defaultValue={mapDefaultValue<OptionData, keyof OptionData>(delayTimeArray, formdata.delay_time || '0', 'value', 'name')}
                      onChange={delayTime}
                      autoFocus={false}
                      placeholder={t('selectDelay')}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('door')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(doorArray, 'value', 'name')}
                      defaultValue={mapDefaultValue<OptionData, keyof OptionData>(doorArray, String(formdata.door) || '0', 'value', 'name')}
                      onChange={doorSelected}
                      autoFocus={false}
                      placeholder={t('selectDoor')}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={4}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    {t('probeChanel')}
                    <Select
                      options={mapOptions<OptionData, keyof OptionData>(channelArray, 'value', 'name')}
                      defaultValue={mapDefaultValue<OptionData, keyof OptionData>(channelArray, String(formdata.probeCh) || '0', 'value', 'name')}
                      onChange={channelSelected}
                      autoFocus={false}
                      placeholder={t('selectChanel')}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "var(--border-dark-color)" : "var(--grey)",
                          boxShadow: state.isFocused ? "0 0 0 1px var(--main-color)" : "",
                          borderRadius: "var(--border-radius-big)"
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary50: 'var(--main-color-opacity2)',
                          primary25: 'var(--main-color-opacity2)',
                          primary: 'var(--main-color)',
                        },
                      })}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={-40}
                            max={formdata.tempvalue[1]}
                            step={.1}
                            value={formdata.tempvalue[0]}
                            onChange={(e) => setFormdata({ ...formdata, tempvalue: [Number(e.target.value), formdata.tempvalue[1]] })} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('tempMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={formdata.tempvalue[0]}
                            max={120}
                            step={.1}
                            value={formdata.tempvalue[1]}
                            onChange={(e) => setFormdata({ ...formdata, tempvalue: [formdata.tempvalue[0], Number(e.target.value)] })} />
                          <strong>°C</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'temp'}>
                      <Slider
                        value={formdata.tempvalue}
                        onChange={handleTempChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={-40}
                        max={120}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMin')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={0}
                            max={formdata.humvalue[1]}
                            step={.1}
                            value={formdata.humvalue[0]}
                            onChange={(e) => setFormdata({ ...formdata, humvalue: [Number(e.target.value), formdata.humvalue[1]] })} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                      <SliderLabelFlex>
                        <span>{t('humiMax')}</span>
                        <div>
                          <RangeInputText type="number"
                            min={formdata.humvalue[0]}
                            max={100}
                            step={.1}
                            value={formdata.humvalue[1]}
                            onChange={(e) => setFormdata({ ...formdata, humvalue: [formdata.humvalue[0], Number(e.target.value)] })} />
                          <strong>%</strong>
                        </div>
                      </SliderLabelFlex>
                    </SliderFlex>
                    <SliderRangeFlex $rangename={'hum'}>
                      <Slider
                        value={formdata.humvalue}
                        onChange={handleHumChange}
                        valueLabelDisplay="off"
                        disableSwap
                        min={0}
                        max={100}
                        step={.1}
                      />
                    </SliderRangeFlex>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustTemp')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          value={formdata.adjust_temp}
                          onChange={(e) => setFormdata({ ...formdata, adjust_temp: Number(e.target.value) })} />
                        <strong>°C</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary='temp'>
                      <Slider
                        color="error"
                        min={-20}
                        max={20}
                        step={.1}
                        value={Number(formdata.adjust_temp)}
                        onChange={handleAdjusttempChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={6}>
                <InputGroup className="mb-3">
                  <Form.Label className="w-100">
                    <SliderLabelFlex>
                      <span>{t('adjustHumi')}</span>
                      <div>
                        <RangeInputText type="number"
                          min={-20}
                          max={20}
                          step={.1}
                          value={formdata.adjust_hum}
                          onChange={(e) => setFormdata({ ...formdata, adjust_hum: Number(e.target.value) })} />
                        <strong>%</strong>
                      </div>
                    </SliderLabelFlex>
                    <FormSliderRange
                      $primary='hum'>
                      <Slider
                        color="primary"
                        min={-20}
                        max={20}
                        step={.1}
                        value={Number(formdata.adjust_hum)}
                        onChange={handleAdjusthumChange}
                        valueLabelDisplay="off" />
                    </FormSliderRange>
                  </Form.Label>
                </InputGroup>
              </Col>
              <Col lg={12}>
                <AdjustRealTimeFlex $primary={Number((mqttData.temp + Number(formdata.adjust_temp)).toFixed(2)) >= formdata.tempvalue[1] || Number((mqttData.temp + Number(formdata.adjust_temp)).toFixed(2)) <= formdata.tempvalue[0]}>
                  <div>
                    <span>{t('currentTemp')}</span>
                    <div>
                      <span>
                        <span>{mqttData.temp.toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                  <RiArrowRightLine size={32} fill="grey" />
                  <RiArrowDownLine size={32} fill="grey" />
                  <div>
                    <span>{t('adjustAfterTemp')}</span>
                    <div>
                      <span>
                        <span>{(mqttData.temp + Number(formdata.adjust_temp) - Number(probeData?.adjustTemp)).toFixed(2)}</span> °C
                      </span>
                    </div>
                  </div>
                </AdjustRealTimeFlex>
              </Col>
              <Col lg={12}>
                <AdjustRealTimeFlex $primary={Number((mqttData.humi + Number(formdata.adjust_hum)).toFixed(2)) >= formdata.humvalue[1] || Number((mqttData.humi + Number(formdata.adjust_hum)).toFixed(2)) <= formdata.humvalue[0]}>
                  <div>
                    <span>{t('currentHum')}</span>
                    <div>
                      <span>
                        <span>{mqttData.humi.toFixed(2)}</span> %
                      </span>
                    </div>
                  </div>
                  <RiArrowRightLine size={32} fill="grey" />
                  <RiArrowDownLine size={32} fill="grey" />
                  <div>
                    <span>{t('adjustAfterHum')}</span>
                    <div>
                      <span>
                        <span>{(mqttData.humi + Number(formdata.adjust_hum) - Number(probeData?.adjustHum)).toFixed(2)}</span> %
                      </span>
                    </div>
                  </div>
                </AdjustRealTimeFlex>
              </Col>
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
    </>
  )
}
