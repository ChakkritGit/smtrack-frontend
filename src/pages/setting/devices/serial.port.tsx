/// <reference path="./serial.d.ts" />

import { Terminal } from "@xterm/xterm"
import CryptoJS from "crypto-js"
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js"
import { useEffect, useRef } from "react"
import { useState } from "react"
import { Col, Container, Form, Row } from "react-bootstrap"
import { Breadcrumbs, Typography } from "@mui/material"
import { RiArrowRightSLine, RiCloseFill, RiEraserLine, RiFileCopyLine, RiListSettingsFill, RiLoopRightFill, RiStopCircleLine, RiTerminalBoxLine, RiUsbLine } from "react-icons/ri"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ConnectButton, ConnectionFlex, ConsoleFlex, DisConnectButton, EraseButton, FlashFirmwareContainer,
  ProgramButton, ProgressBar, ResetButton, StartConsoleButton, StopConsoleButton, TraceButton
} from "../../../style/components/firmwareuoload"
import toast from "react-hot-toast"
import TerminalComponent from "../../../components/settings/terminal"

const term = new Terminal({ cols: 150, rows: 40 })
term.options = {
  fontSize: 12,
  fontFamily: 'Courier New',
  cursorStyle: 'block',
  theme: {
    background: '#353535'
  }
}

let device: SerialPort
let transport: Transport
let esploader: ESPLoader
let isConsoleClosed = false

const filters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 }
]

const ESPToolComponent = () => {
  const { t } = useTranslation()
  const terminalRef = useRef<HTMLDivElement>(null)
  const erasButtonRef = useRef<HTMLButtonElement>(null)
  const [consoleStart, setconsoleStart] = useState(false)
  const [chip, setChip] = useState('')
  const [fileData, setFileData] = useState<{ data: string | ArrayBuffer | null | undefined, address: number }>({ data: '', address: 0x10000 })
  const [progress, setProgress] = useState('')

  useEffect(() => {
    if (terminalRef.current) {
      term.open(terminalRef.current)
    }
  }, [terminalRef.current])

  const handleFileSelect = (evt: any) => {
    const file = evt.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      setFileData({ ...fileData, data: ev.target?.result })
    }

    reader.readAsBinaryString(file)
  }

  const espLoaderTerminal = {
    clean() {
      term.clear()
    },
    writeLine(data: string | Uint8Array) {
      term.writeln(data)
    },
    write(data: string | Uint8Array) {
      term.write(data)
    },
  }

  const connectDevice = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    let chipInfo = ''

    try {
      const flashOptions = {
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)
      chipInfo = await esploader.main()
      setChip(chipInfo)

      // Temporarily broken
      await esploader.flashId()
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      toast.success(`Connected: ${chipInfo}`, {
        duration: 6000,
      })
      console.log("Settings done for :" + chipInfo)
    }
  }

  const traceFunc = async () => {
    if (transport) {
      transport.returnTrace()
    }
  }

  const resetFunc = async () => {
    term.reset()
    if (transport) {
      await transport.setDTR(false)
      await new Promise((resolve) => setTimeout(resolve, 100))
      await transport.setDTR(true)
    }
  }

  const eraseFunc = async () => {
    erasButtonRef.current!!.disabled = true
    try {
      await esploader.eraseFlash()
    } catch (e: any) {
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      erasButtonRef.current!!.disabled = false
    }
  }

  const disconnectFunc = async () => {
    if (transport) await transport.disconnect()
    term.reset()
    await cleanUp()
  }

  const cleanUp = async () => {
    device = null as unknown as SerialPort
    transport = null as unknown as Transport
    setChip('')
    setFileData({ ...fileData, data: '' })
  }

  const consoleStartFunc = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    setconsoleStart(true)

    await transport.connect(115200)
    isConsoleClosed = false

    const decoder = new TextDecoder()

    for await (const chunk of transport.rawRead()) {
      if (chunk instanceof Uint8Array) {
        const decodedChunk = decoder.decode(chunk)
        term.write(decodedChunk)
      } else {
        console.warn("Unexpected data type:", chunk)
      }

      if (isConsoleClosed) {
        break
      }
    }
    console.log("quitting console")
  }

  const consoleStopFunc = async () => {
    isConsoleClosed = true
    if (transport) {
      await transport.disconnect()
      await transport.waitForUnlock(1500)
    }
    setconsoleStart(false)
    term.reset()
    cleanUp()
  }

  const programFunc = async () => {
    if (fileData.data === '') {
      toast.error('Please Select File')
      return
    }

    try {
      const flashOptions: FlashOptions = {
        fileArray: [fileData],
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          setProgress(((written / total) * 100).toFixed(2))
          if (((written / total) * 100).toFixed() === '100') {
            toast.success('Firmware flashed')
          }
        },
        calculateMD5Hash: (image): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)) as unknown as string,
      } as FlashOptions
      await esploader.writeFlash(flashOptions)
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      if (transport) await transport.disconnect()
      term.reset()
      toast.success('Starting console...')
      consoleStartFunc()
      setChip('')
      setFileData({ ...fileData, data: '' })
      setProgress('')
    }
  }

  useEffect(() => {
    return () => {
      disconnectFunc()
      setconsoleStart(false)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = '' // ตามสเปคของ HTML5
    }

    if (progress !== '') {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [progress])

  return (
    <Container fluid>
      <Breadcrumbs className="mt-3"
        separator={<RiArrowRightSLine fontSize={20} />}
      >
        <Link to={'/management'}>
          <RiListSettingsFill size={20} />
        </Link>
        <Typography color="text.primary">{t('writeFirmware')}</Typography>
      </Breadcrumbs>
      <FlashFirmwareContainer>
        <div>
          <h3>{t('writeFirmware')}</h3>
          {
            !consoleStart && <ConnectionFlex>
              {chip === '' ? <ConnectButton onClick={connectDevice}>
                <RiUsbLine size={24} />
                {t('connectDevice')}
              </ConnectButton>
                :
                <ConnectionFlex>
                  <DisConnectButton $primary={progress !== ''} onClick={disconnectFunc} disabled={progress !== ''}>
                    <RiCloseFill size={24} />
                    {t('disConnectDevice')}
                  </DisConnectButton>
                  <div>
                    <TraceButton onClick={traceFunc}>
                      <RiFileCopyLine size={24} />
                      {t('copyTrace')}
                    </TraceButton>
                    <EraseButton $primary={true} onClick={eraseFunc} ref={erasButtonRef} disabled={true}>
                      <RiEraserLine size={24} />
                      {t('eraseMemory')}
                    </EraseButton>
                  </div>
                </ConnectionFlex>
              }
            </ConnectionFlex>
          }
          {
            chip && <>
              <hr />
              <Row className="d-flex align-items-center">
                <Col lg={3}>
                  <Form.Group controlId="formFile">
                    <Form.Control type="file" onChange={handleFileSelect} />
                  </Form.Group>
                </Col>
                <Col lg={9}>
                  <ProgramButton onClick={programFunc}>
                    {t('programBoard')}
                  </ProgramButton>
                </Col>
              </Row>
            </>
          }
        </div>
        <hr />
        {
          chip === '' && <>
            <>
              <h3>{t('consoleText')}</h3>
              <ConsoleFlex>
                {
                  consoleStart ? <>
                    <StopConsoleButton onClick={consoleStopFunc}>
                      <RiStopCircleLine size={24} />
                      {t('stopconButton')}
                    </StopConsoleButton>
                    <ResetButton onClick={resetFunc}>
                      <RiLoopRightFill size={24} />
                      {t('resetconButton')}
                    </ResetButton>
                  </>
                    :
                    <StartConsoleButton onClick={consoleStartFunc}>
                      <RiTerminalBoxLine size={24} />
                      {t('startconButton')}
                    </StartConsoleButton>
                }
              </ConsoleFlex>
            </>
            <hr />
          </>
        }
        <ProgressBar $primary={progress} />
        <TerminalComponent terminalRef={terminalRef} />
      </FlashFirmwareContainer>
    </Container>
  )
}

export default ESPToolComponent