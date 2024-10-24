import { useNavigate } from "react-router-dom"
import { DashBoardCardBody, DashBoardCardFlex, DashBoardCardHead, DashBoardCardSpan, DashBoardCardSpanTitle } from "../../style/style"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { client } from "../../services/mqtt"
import { SdCardData, SdCardMqttLoad } from "../../style/components/dashboard.styled"

type CardstatusNomal = {
  title: string,
  valuestext: number | string | undefined,
  svg: ReactNode,
  alertone?: boolean,
  pathName?: string,
  onClick: () => void,
  showSdDetail?: boolean,
  devObj?: {
    devSerial: string,
    deviceModel: string,
    version: string
  }
}

type CardstatusSpecial = {
  title: string,
  valuesone?: number | string,
  valuestwo?: number | string,
  pipeone?: string,
  pipetwo?: string,
  svg: ReactNode,
  alertone?: boolean,
  alerttwo?: boolean,
}

type MqttMemoryType = {
  used: string,
  free: string,
  total: string
}

export function CardstatusNomal(CardstatusNomal: CardstatusNomal) {
  const { pathName, onClick, showSdDetail, title, devObj } = CardstatusNomal
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [memory, setMemory] = useState<MqttMemoryType>({
    free: '',
    total: '',
    used: ''
  })

  const onHandle = () => {
    if (pathName !== undefined) {
      navigate(String(pathName))
    } else {
      onClick()
    }
  }

  useEffect(() => {
    if (showSdDetail) {
      client.subscribe(`${devObj?.devSerial}/sd/memory`, (err) => {
        if (err) {
          console.error("MQTT Suubscribe Error", err)
        }
      })

      client.publish(`siamatic/${devObj?.deviceModel}/${devObj?.version}/${devObj?.devSerial}/sd/memory`, 'on')

      client.on('message', (_topic, message) => {
        setMemory(JSON.parse(message.toString()))
      })

      client.on("error", (err) => {
        console.error("MQTT Error: ", err)
        client.end()
      })

      client.on("reconnect", () => {
        console.error("MQTT Reconnecting...")
      })
    }
  }, [showSdDetail])

  const formatSize = (sizeInKB: number) => {
    if (sizeInKB >= 1024 ** 2) {
      return `${(sizeInKB / (1024 ** 2)).toFixed(2)} GB`
    } else if (sizeInKB >= 1024) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`
    } else {
      return `${sizeInKB.toFixed(2)} KB`
    }
  }

  return (
    <DashBoardCardFlex
      onClick={onHandle}
      $primary={pathName !== undefined}
      $seccond={title === t('dashSdCard')}
    >
      <DashBoardCardHead>
        {CardstatusNomal.svg}
        <DashBoardCardSpanTitle>
          {CardstatusNomal.title}
        </DashBoardCardSpanTitle>
      </DashBoardCardHead>
      {
        showSdDetail ?
          memory.total !== '' ?
            <SdCardData>
              <div>
                <div>
                  <span>Used: </span>
                  <span>{formatSize(Number(memory.used))}</span>
                </div>
                <div>
                  <span>Free: </span>
                  <span>{formatSize(Number(memory.free))}</span>
                </div>
                <div>
                  <span>Size: </span>
                  <span>{formatSize(Number(memory.total))}</span>
                </div>
              </div>
            </SdCardData>
            :
            <SdCardMqttLoad>{t('loadingConfig')}</SdCardMqttLoad>
          :
          <>
            <DashBoardCardSpan $primary $alertone={CardstatusNomal.alertone}>
              {CardstatusNomal.valuestext}
            </DashBoardCardSpan>
          </>
      }
    </DashBoardCardFlex>
  )
}

export function CardstatusSpecial(CardstatusSpecial: CardstatusSpecial) {
  return (
    <DashBoardCardFlex>
      <DashBoardCardHead>
        {CardstatusSpecial.svg}
        <DashBoardCardSpanTitle>
          {CardstatusSpecial.title}
        </DashBoardCardSpanTitle>
      </DashBoardCardHead>
      <DashBoardCardBody>
        <div>
          <DashBoardCardSpan $alertone={CardstatusSpecial.alertone}>
            {CardstatusSpecial.valuesone}
            <sub>{CardstatusSpecial.pipeone}</sub>
          </DashBoardCardSpan>
        </div>
        <div>
          <DashBoardCardSpan $alerttwo={CardstatusSpecial.alertone}>
            <span>{CardstatusSpecial.valuestwo}</span>
            <sub>{CardstatusSpecial.pipetwo}</sub>
          </DashBoardCardSpan>
        </div>
      </DashBoardCardBody>
    </DashBoardCardFlex>
  )
}
