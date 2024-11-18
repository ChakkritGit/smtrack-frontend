import { Modal } from "react-bootstrap"
import { LineHr, ModalHead } from "../../style/style"
import { ModalMuteHead, NotiActionFlex } from "../../style/components/home.styled"
import { useTranslation } from "react-i18next"
import { RiArrowLeftSLine } from "react-icons/ri"
import { devicesType } from "../../types/device.type"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { MuteEtemp } from "../../style/components/sound.setting"
import { cookies, generateOptions, generateOptionsOne, generateOptionsTwo, mapDefaultValue, mapOptions } from "../../constants/constants"
import { client } from "../../services/mqtt"
import Select from 'react-select'
import { useTheme } from "../../theme/ThemeProvider"
import { useSelector } from "react-redux"
import { RootState } from "../../stores/store"

type selectOption = {
  value: string,
  label: string
}

type MqttType = {
  tempTemporary: string | boolean;
  tempDuration: string,
  doorAlarm: string,
  doorDuration: string
}


type modalAdjustType = {
  devicesdata: devicesType,
  setShowSettingMute: Dispatch<SetStateAction<boolean>>,
  setShow: Dispatch<SetStateAction<boolean>>,
  showSettingMute: boolean,
}

function ModalMute(modalProps: modalAdjustType) {
  const { devicesdata, setShow, setShowSettingMute, showSettingMute } = modalProps
  const { cookieDecode } = useSelector((state: RootState) => state.utilsState)
  const { userLevel } = cookieDecode
  const { devSerial, config } = devicesdata
  const { t } = useTranslation()
  const { theme } = useTheme()
  const deviceModel = devSerial.substring(0, 3) === "eTP" ? "etemp" : "items"
  const version = devSerial.substring(3, 5).toLowerCase()
  const [muteDoorSelect, setMuteDoorSelect] = useState<MqttType>({
    tempTemporary: false,
    tempDuration: '',
    doorAlarm: '',
    doorDuration: ''
  })
  const [muteDoor, setMuteDoor] = useState<MqttType>({
    tempTemporary: '',
    tempDuration: '',
    doorAlarm: '',
    doorDuration: '',
  })

  const { doorAlarm, doorDuration, tempDuration, tempTemporary } = muteDoor

  useEffect(() => {
    if (tempTemporary === 'on') {
      setMuteDoorSelect({ ...muteDoorSelect, tempTemporary: !tempTemporary })
    }
  }, [tempTemporary])

  const [muteEtemp, setMuteEtemp] = useState({
    duration: cookies.get(devSerial) === 'duration' || false,
    door: config.muteDoor === '0' ? false : true,
  })

  const closeSettingMute = () => {
    setShowSettingMute(false)
    setShow(true)
  }

  const muteTemporary = () => {
    setMuteDoorSelect({ ...muteDoorSelect, tempTemporary: !muteDoorSelect.tempTemporary })
    if (!muteDoorSelect.tempTemporary) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temp/temporary`, 'on')
      client.publish(`${devSerial}/mute/short`, 'on')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temp/temporary`, 'off')
      client.publish(`${devSerial}/mute/short`, 'off')
    }
  }

  const muteAlarm = () => {
    setMuteEtemp({ ...muteEtemp, door: !muteEtemp.door })
    if (!muteEtemp.door) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/sound`, 'on')
      client.publish(`${devSerial}/mute/long`, 'on')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/sound`, 'off')
      client.publish(`${devSerial}/mute/long`, 'off')
    }
  }

  const muteAlways = (status: boolean) => {
    if (status) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temp/duration`, muteDoorSelect.tempDuration)
      resetSelct('tempDuration')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/temp/duration`, '0')
    }
  }

  const muteAlert = (status: boolean) => {
    if (status) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alarm`, muteDoorSelect.doorAlarm)
      resetSelct('doorAlarm')
    } else {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/door/alarm`, '0')
    }
  }

  const muteDoorDuration = (status: boolean) => {
    if (status) {
      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/door/alarm/duration`, muteDoorSelect.doorDuration)
      resetSelct('doorDuration')
    }
  }

  const resetSelct = (text: string) => {
    text === 'tempDuration' ? setMuteDoorSelect({ ...muteDoorSelect, tempDuration: '' }) : text === 'doorAlarm' ? setMuteDoorSelect({ ...muteDoorSelect, doorAlarm: '' }) : setMuteDoorSelect({ ...muteDoorSelect, doorDuration: '' })
  }

  useEffect(() => {
    if (showSettingMute) {
      client.subscribe(`${devSerial}/mute/status/receive`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      client.publish(`siamatic/${deviceModel}/${version}/${devSerial}/mute/status`, 'on')

      client.on('message', (_topic, message) => {
        setMuteDoor(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [showSettingMute])

  return (
    <Modal size="lg" show={showSettingMute} onHide={closeSettingMute}>
      <Modal.Header>
        <ModalHead>
          <ModalMuteHead onClick={closeSettingMute}>
            <button>
              <RiArrowLeftSLine />
            </button>
            <span>
              {t('muteSettings')}
            </span>
          </ModalMuteHead>
        </ModalHead>
      </Modal.Header>
      <Modal.Body>
        <NotiActionFlex $primary={doorAlarm === '' && tempDuration === ''}>
          {
            doorAlarm !== '' && tempDuration !== '' ?
              <>
                <h5 className="text-decoration-underline">{t('countProbe')}</h5>
                {deviceModel === 'etemp' && <div>
                  <span>{t('muteTemporary')}</span>
                  {/* <button onClick={muteTemporary}>
                    {muteEtemp.temporary ? <RiVolumeVibrateLine size={24} /> : <RiVolumeUpLine size={24} />}
                  </button> */}
                  <MuteEtemp type="button" onClick={muteTemporary} $primary={muteDoorSelect.tempTemporary} $disable={devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMax} disabled={devicesdata.log[0]?.tempAvg <= devicesdata.probe[0]?.tempMax}>
                    <div className="icon">
                      {muteDoorSelect.tempTemporary ? t('stateOn') : t('stateOff')}
                    </div>
                  </MuteEtemp>
                </div>}
                <div>
                  <div>
                    <span>{t('muteAlways')}</span>
                    <span>{tempDuration}</span>
                  </div>
                  <div>
                    <Select
                      id="hours-one"
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(generateOptionsOne(userLevel), 'value', 'label')}
                      value={mapDefaultValue<selectOption, keyof selectOption>(generateOptionsOne(userLevel), muteDoorSelect.tempDuration, 'value', 'label')}
                      onChange={(e) => { setMuteDoorSelect((prev) => ({ ...prev, tempDuration: String(e?.value) })); setMuteDoor((prev) => ({ ...prev, tempDuration: String(e?.value) })) }}
                      autoFocus={false}
                      placeholder={'เลือกเวลา'}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          backgroundColor: theme.mode === 'dark' ? "var(--main-last-color)" : "var(--white-grey-1)",
                          borderColor: theme.mode === 'dark' ? "`var(--border-dark-color)" : "var(--grey)",
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
                    <button onClick={() => muteAlways(true)}>{t('messageSend')}</button>
                    <button onClick={() => muteAlways(false)}>{t('cancelButton')}</button>
                  </div>
                </div>
                <LineHr $mg={.5} />
                <h5 className="text-decoration-underline">{t('countDoor')}</h5>
                <div>
                  <span>{t('muteDoor')}</span>
                  <MuteEtemp type="button" onClick={muteAlarm} $primary={muteEtemp.door}>
                    <div className="icon">
                      {muteEtemp.door ? t('stateOn') : t('stateOff')}
                    </div>
                  </MuteEtemp>
                </div>
                <div>
                  <div>
                    <span>{t('muteDoorDuration')}</span>
                    <span>{doorDuration}</span>
                  </div>
                  <div>
                    <Select
                      id="hours-two"
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(generateOptionsTwo(), 'value', 'label')}
                      value={mapDefaultValue<selectOption, keyof selectOption>(generateOptionsTwo(), muteDoorSelect.doorDuration, 'value', 'label')}
                      onChange={(e) => { setMuteDoorSelect((prev) => ({ ...prev, doorDuration: String(e?.value) })); setMuteDoor((prev) => ({ ...prev, doorDuration: String(e?.value) })) }}
                      autoFocus={false}
                      placeholder={'เลือกเวลา'}
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
                    <button onClick={() => muteDoorDuration(true)}>{t('messageSend')}</button>
                  </div>
                </div>
                <div>
                  <div>
                    <span>{t('muteAlert')}</span>
                    <span>{doorAlarm}</span>
                  </div>
                  <div>
                    <Select
                      id="hours-three"
                      key={JSON.stringify(muteDoorSelect)}
                      options={mapOptions<selectOption, keyof selectOption>(generateOptions(userLevel), 'value', 'label')}
                      value={mapDefaultValue<selectOption, keyof selectOption>(generateOptions(userLevel), muteDoorSelect.doorAlarm, 'value', 'label')}
                      onChange={(e) => { setMuteDoorSelect((prev) => ({ ...prev, doorAlarm: String(e?.value) })); setMuteDoor((prev) => ({ ...prev, doorAlarm: String(e?.value) })) }}
                      autoFocus={false}
                      placeholder={'เลือกเวลา'}
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
                    <button onClick={() => muteAlert(true)}>{t('messageSend')}</button>
                    <button onClick={() => muteAlert(false)}>{t('cancelButton')}</button>
                  </div>
                </div>
              </>
              :
              <div>{t('loadingConfig')}</div>
          }
        </NotiActionFlex>

      </Modal.Body>
      {/* <Modal.Footer>
        <FormFlexBtn>
          <FormBtn type="submit">
            {t('notificationButtonSubmit')}
          </FormBtn>
        </FormFlexBtn>
      </Modal.Footer> */}
    </Modal>
  )
}

export default ModalMute