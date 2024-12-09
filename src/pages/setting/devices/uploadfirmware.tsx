import { useTranslation } from "react-i18next"
import {
  CheckBoxFlex,
  CheckBoxInput,
  CheckBoxList,
  DropContainer, DropHereFile, FileDroped, FileList, FirewareContent, FirmwareContainer,
  FirmwareHeader, ProgressBar, RowChildren, SelectDevicetoUpdateButton, SelectFWFlex, UploadButton
} from "../../../style/components/firmwareuoload"
import { useDispatch, useSelector } from "react-redux"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import { FormBtn, FormFlexBtn, ModalHead, NavRightPipe, PaginitionContainer } from "../../../style/style"
import {
  RiCheckboxLine,
  RiCloseCircleLine, RiCloseLine, RiCodeSSlashLine, RiDeleteBin2Line, RiDownloadCloud2Line,
  RiDownloadLine, RiDragDropLine, RiFileCheckLine, RiFileUploadLine,
  RiUploadLine
} from "react-icons/ri"
import { FileUploader } from "react-drag-drop-files"
import { CircularProgressbar } from 'react-circular-progressbar'
import { filesize } from "filesize"
import { responseType } from "../../../types/response.type"
import { Terminal } from "@xterm/xterm"
import { ESPLoader, FlashOptions, LoaderOptions, Transport } from "esptool-js"
import { useNavigate } from "react-router-dom"
import { firmwareType } from "../../../types/component.type"
import { swalWithBootstrapButtons } from "../../../constants/sweetalertLib"
import CryptoJS from "crypto-js"
import BinIco from "../../../assets/images/bin-icon.png"
import Swal from "sweetalert2"
import { AxiosError } from "axios"
import Paginition from "../../../components/filter/paginition"
import toast from "react-hot-toast"
import TerminalComponent from "../../../components/settings/terminal"
import { RootState, storeDispatchType } from "../../../stores/store"
import { setSearchQuery, setShowAlert } from "../../../stores/utilsStateSlice"
import { client } from "../../../services/mqtt"
import Select, { SingleValue } from 'react-select'
import { useTheme } from "../../../theme/ThemeProvider"
import { mapDefaultValue, mapOptions } from "../../../constants/constants"
import { Option } from "../../../types/config.type"
import { devicesType } from "../../../types/device.type"
import axiosInstance from "../../../constants/axiosInstance"
import PageLoading from "../../../components/loading/page.loading"

interface FirmwareItem {
  fileName: string;
  fileSize: string;
  createDate: string;
}

const term = new Terminal({ cols: 150, rows: 40 })
term.options = {
  fontSize: 12,
  fontFamily: 'Courier New',
  cursorStyle: 'block',
  theme: {
    background: '#353535'
  }
}

const filters = [
  { usbVendorId: 0x10c4, usbProductId: 0xea60 }
]

let device: SerialPort
let esploader: ESPLoader
let transport: Transport

export default function Uploadfirmware() {
  const { t } = useTranslation()
  const dispatch = useDispatch<storeDispatchType>()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { searchQuery } = useSelector((state: RootState) => state.utilsState)
  const { devices } = useSelector((state: RootState) => state.devices)
  const [show, setShow] = useState(false)
  const [showConsole, setShowConsole] = useState(false)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [dragChang, setDragChang] = useState<boolean>(false)
  const [progress, setProgress] = useState(0)
  const [submit, setSubmit] = useState(false)
  const [error, setError] = useState(false)
  const [dataFiles, setDataFile] = useState<firmwareType[]>([])
  const [fileData, setFileData] = useState<string | ArrayBuffer | null | undefined>(null)
  const [bootLoader, setBootLoader] = useState<string | ArrayBuffer | null | undefined>(null)
  const [parttition, setPartition] = useState<string | ArrayBuffer | null | undefined>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const [flashProgress, setFlashProgress] = useState('0')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [cardsPerPage, setCardsPerPage] = useState<number>(10)
  const [modalSelected, setModalSelected] = useState<boolean>(false)
  const [displayedCards, setDisplayedCards] = useState<firmwareType[]>(dataFiles ? dataFiles.slice(0, cardsPerPage) : [])
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [selectedDevicesOption, setSelectedDevicesOption] = useState(t('selectOTA'))
  const [filterUpdated, setFilterUpdated] = useState(false)
  const [deviceFwFiltered, setDeviceFwFiltered] = useState<devicesType[]>([])
  let onCancel = false
  const fileTypes = ["BIN"]
  let onProgress = 0

  const handleSelectedandClearSelected = (e: SingleValue<Option>) => {
    const selectedValue = e?.value
    if (!selectedValue) return
    setSelectedDevicesOption(selectedValue)
    setSelectedDevices([])
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target

    if (checked) {
      setSelectedDevices([...selectedDevices, value])
    } else {
      setSelectedDevices(selectedDevices.filter(device => device !== value))
    }
  }

  const handleSelectAll = () => {
    const filteredDevices = devices
      .filter((items) => items.devSerial.substring(0, 1).toLowerCase().includes(selectedDevicesOption.substring(0, 1).toLowerCase()))
      .map(device => device.devSerial)

    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(filteredDevices)
    }
  }

  const filterFirmwareUpdated = () => {
    setFilterUpdated(!filterUpdated)
  }

  const publishDeviceUpdate = async (item: string, selectedDevicesOption: string): Promise<void> => {
    const deviceModel = item.substring(0, 3) === "eTP" ? "etemp" : "items"
    const version = item.substring(3, 5).toLowerCase()

    if (!client.connected) {
      throw new Error("Client not connected")
    }

    return new Promise((resolve) => {
      if (onCancel) {
        resolve()
        return
      }

      client.publish(`siamatic/${deviceModel}/${version}/${item}/firmware`, selectedDevicesOption)
      onProgress += 1
      const onProgressing = document.getElementById('onProgressing')
      if (onProgressing) onProgressing.innerText = `${onProgress}`
      setTimeout(resolve, 100)
    })
  }

  const handleUpdate = async () => {
    if (selectedDevices.length > 0) {
      try {
        onProgress = 0
        Swal.fire({
          title: `<div class="swal2-custom-title-container">
                    <div class="swal2-custom-loading-icon"></div>
                    <span>${t('alertHeaderUpdating')}</span>
                  </div>`,
          html: `<div class="swal2-custom-html"><div><span id="onProgressing">0</span>/<span>${selectedDevices.length}</span></div><span>${t('sendingFirmware')}</span><button id="cancelButton">${t('cancelButton')}</button></div>`,
          didOpen: () => {
            const cancelButton = document.getElementById("cancelButton")
            cancelButton?.addEventListener("click", () => {
              onCancel = true
              Swal.close()
            })
          },
          allowOutsideClick: false,
          showConfirmButton: false,
          didRender: () => {
            const loadingIcon = document.querySelector(".swal2-custom-loading-icon")
            if (loadingIcon) loadingIcon.innerHTML = `<div class="swal2-loading"></div>`
          }
        })

        for (const item of selectedDevices.sort()) {
          await publishDeviceUpdate(item, selectedDevicesOption)
          if (onCancel) {
            break
          }
        }

        if (!onCancel) {
          await Swal.fire({
            icon: 'success',
            title: t('alertHeaderSuccess'),
            text: t('sendingFirmwareSuccess'),
            timer: 2000,
            didOpen: () => {
              Swal.hideLoading()
            },
            showConfirmButton: false
          })
          onCancel = false
          onProgress = 0
          setSelectedDevices([])
        } else {
          Swal.close()
          onCancel = false
          onProgress = 0
          setSelectedDevices([])
          await Swal.fire({
            icon: 'success',
            title: t('alertHeaderSuccess'),
            text: t('onCancel'),
            timer: 2000,
            didOpen: () => {
              Swal.hideLoading()
            },
            showConfirmButton: false
          })
        }
      } catch (error) {
        if (error instanceof Error) {
          await Swal.fire({
            icon: 'error',
            title: t('alertHeaderError'),
            html: `${error.message}`,
            timer: 2000,
            didOpen: () => {
              Swal.hideLoading()
            },
            showConfirmButton: false
          })
        } else {
          console.error(error)
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

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''))
    }
  }, [])

  useEffect(() => {
    if (terminalRef.current && showConsole) {
      term.open(terminalRef.current)
    }
  }, [showConsole])

  const fetchFiles = async () => {
    try {
      const response = await axiosInstance.get<responseType<firmwareType[]>>(`${import.meta.env.VITE_APP_API}/firmwares`)
      setDataFile(response.data.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error(error)
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
    fetchFiles()
  }, [])

  const openModalSelected = () => {
    setModalSelected(true)
  }

  const closeModalSelected = () => {
    setModalSelected(false)
    setSelectedDevices([])
    setSelectedDevicesOption(t('selectOTA'))
  }

  const openModalConsole = () => {
    setShowConsole(true)
  }

  const closeModalConsole = async () => {
    setShowConsole(false)
    term.clear()
    setDownloadProgress(0)
    setFlashProgress('0')
    await cleanUp()
  }

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setFile(undefined)
    setSubmit(false)
    setError(false)
    setProgress(0)
    setShow(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('fileupload', file as Blob)
    if (file) {
      try {
        setSubmit(true)
        const response = await axiosInstance.post<responseType<string>>(`${import.meta.env.VITE_APP_API}/firmwares`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }, onUploadProgress: (progressEvent) => {
            const { progress } = progressEvent
            setProgress(Number(progress) * 100)
          }
        })
        Swal.fire({
          title: t('alertHeaderSuccess'),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        closeModal()
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
          setError(true)
        } else {
          Swal.fire({
            title: t('alertHeaderError'),
            text: 'Uknown Error',
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          })
          setError(true)
        }
      } finally {
        fetchFiles()
      }
    } else {
      Swal.fire({
        title: t('alertHeaderWarning'),
        text: t('selectedFile'),
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleChange = (files: File) => {
    if (files) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
      setFile(files)
    }
  }

  const handleDrag = (dragging: boolean) => {
    setDragChang(dragging)
    if (dragging) {
      setFile(undefined)
      setSubmit(false)
      setError(false)
    }
  }

  const handleError = (_error: string) => {
    Swal.fire({
      title: t('alertHeaderError'),
      text: t('uploadLabelNotSupport'),
      icon: "error",
      timer: 2000,
      showConfirmButton: false,
    })
  }

  const UploadJSXStyle = () => (
    <DropContainer $primary={file} $error={error}>
      {
        file ?
          <FileDroped $primary={submit} $error={error}>
            <div>
              {submit ?
                error ?
                  <RiCloseCircleLine size={128} />
                  :
                  <CircularProgressbar
                    value={progress}
                    text={`${progress.toFixed()}%`} />
                :
                <RiFileCheckLine size={128} />}
            </div>
            <div>
              <span>{file?.name}</span>
              <span>{filesize(file?.size, { standard: "jedec" })}</span>
            </div>
          </FileDroped>
          :
          !dragChang ? <DropHereFile>
            <div>
              <RiDragDropLine size={128} />
            </div>
            <span>{t('uploadLabel')}</span>
          </DropHereFile> : <></>
      }
    </DropContainer>
  )

  const getBootLoader = async () => {
    try {
      const bootloader = await axiosInstance.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/bootloader.bin`, {
        responseType: 'blob'
      })

      const file = new File([bootloader.data], 'bootloader.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setBootLoader(ev.target?.result)
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  const getPartition = async () => {
    try {
      const partition = await axiosInstance.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/partitions.bin`, {
        responseType: 'blob'
      })

      const file = new File([partition.data], 'partition.bin', { type: 'application/octet-stream' }); // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setPartition(ev.target?.result)
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    }
  }

  useEffect(() => {
    if (downloadProgress > 0 && downloadProgress <= 99) {
      toast(`Downloading... ${downloadProgress.toFixed()}%`, {
        icon: <RiDownloadLine size={24} />,
      })
    } else if (downloadProgress === 100) {
      toast.success(`Downloaded ${downloadProgress.toFixed()}%`)
    }
  }, [downloadProgress])

  const downloadFw = async (fileName: string) => {
    try {
      const response = await axiosInstance.get<Blob>(`${import.meta.env.VITE_APP_API}/firmware/${fileName}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const { progress } = progressEvent
          setDownloadProgress(Number(progress) * 100)
        }
      })

      const file = new File([response.data], 'firmware.bin', { type: 'application/octet-stream' }) // สร้าง File object

      const reader = new FileReader()

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        setFileData(ev.target?.result)
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setShowAlert(true))
        } else {
          console.error('Something wrong' + error)
        }
      } else {
        console.error('Uknown error: ', error)
      }
    } finally {
      openModalConsole()
    }
  }

  const deleteFw = async (fileName: string) => {
    try {
      const response = await axiosInstance.delete<responseType<firmwareType>>(`${import.meta.env.VITE_APP_API}/firmwares/${fileName}`)
      Swal.fire({
        title: t('alert_header_Success'),
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
    } finally {
      fetchFiles()
    }
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

  useEffect(() => {
    if (fileData !== null && parttition !== null && bootLoader !== null) {
      programFunc()
    }
  }, [fileData, parttition, bootLoader])

  const programFunc = async () => {
    if (!device) {
      device = await navigator.serial.requestPort({ filters })
      transport = new Transport(device, true)
    }

    try {
      const flashOptions = {
        transport,
        baudrate: 115200,
        terminal: espLoaderTerminal,
      } as LoaderOptions
      esploader = new ESPLoader(flashOptions)

      await esploader.main()

      // Temporarily broken
      await esploader.flashId()
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
      cleanUp()
    }

    try {
      await esploader.eraseFlash()
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    }

    const fileArray = []

    if (fileData && parttition && bootLoader) {
      fileArray.push({ data: bootLoader, address: 0x1000 })
      fileArray.push({ data: parttition, address: 0x8000 })
      fileArray.push({ data: fileData, address: 0x10000 })
    } else {
      console.error('No file data available')
      return
    }

    try {
      const flashOptions: FlashOptions = {
        fileArray: fileArray,
        flashSize: "keep",
        eraseAll: false,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          setFlashProgress(((written / total) * 100).toFixed(2))
        },
        calculateMD5Hash: (image): string => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)) as unknown as string,
      } as FlashOptions
      await esploader.writeFlash(flashOptions)
    } catch (e: any) {
      toast.error(e.message)
      console.error(e)
      term.writeln(`Error: ${e.message}`)
    } finally {
      await cleanUp()
    }
  }

  const cleanUp = async () => {
    if (transport) await transport.disconnect()
    setFileData(null)
    device = null as unknown as SerialPort
    transport = null as unknown as Transport
  }

  useEffect(() => {
    setCurrentPage(0)
    setDisplayedCards(dataFiles ? dataFiles.slice(0, cardsPerPage) : [])
    showPage(0, searchQuery)
  }, [searchQuery, dataFiles, cardsPerPage])

  useEffect(() => {
    showPage(currentPage, searchQuery)
  }, [currentPage, dataFiles, cardsPerPage])

  const showPage = (pageNumber: number, query: string = '') => {
    const startIndex = pageNumber * cardsPerPage
    const endIndex = startIndex + cardsPerPage
    const filteredCards = dataFiles ? (query ? dataFiles.filter(card => [card.fileName, card.createDate].some(attr => attr.toLowerCase().includes(query.toLowerCase()))) : dataFiles) : []
    const cardsToDisplay = filteredCards ? filteredCards.slice(startIndex, endIndex) : []
    setDisplayedCards(cardsToDisplay)
  }

  const changePage = (change: number) => {
    setCurrentPage(currentPage + change)
  }

  const displaySelectDevices = (event: ChangeEvent<HTMLSelectElement>) => {
    setCardsPerPage(Number(event.target.value))
  }

  useEffect(() => {
    return () => {
      cleanUp()
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    if (flashProgress !== '0') {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const versionCompare = (a: FirmwareItem, b: FirmwareItem) => {
    const versionA = a.fileName.match(/(\d+)\.(\d+)\.(\d+)/)
    const versionB = b.fileName.match(/(\d+)\.(\d+)\.(\d+)/)

    if (a.fileName.startsWith('i-TeM') && !b.fileName.startsWith('i-TeM')) return 1
    if (b.fileName.startsWith('i-TeM') && !a.fileName.startsWith('i-TeM')) return -1

    if (versionA && versionB) {
      const majorA = parseInt(versionA[1], 10)
      const minorA = parseInt(versionA[2], 10)
      const patchA = parseInt(versionA[3], 10)

      const majorB = parseInt(versionB[1], 10)
      const minorB = parseInt(versionB[2], 10)
      const patchB = parseInt(versionB[3], 10)

      return (
        majorA - majorB ||
        minorA - minorB ||
        patchA - patchB
      )
    }
    return 0
  }

  const combinedList = displayedCards
    .filter((filter) =>
      !filter.fileName.startsWith('bootloader') &&
      !filter.fileName.startsWith('partition')
    )
    .sort(versionCompare)

  const combinedListTwo = dataFiles
    .filter((filter) =>
      !filter.fileName.startsWith('bootloader') &&
      !filter.fileName.startsWith('partition')
    )
    .sort(versionCompare)

  const allFile: firmwareType = { createDate: '', fileName: t('selectOTA'), fileSize: '' }

  const updatedDevData = [allFile, ...combinedListTwo]

  useEffect(() => {
    const newFilter = selectedDevicesOption.endsWith('bin') ? selectedDevicesOption.split('v')[1].split('.b')[0] : ''
    if (filterUpdated) {
      setDeviceFwFiltered(devices.filter((items) => items.firmwareVersion?.toLowerCase() !== newFilter.toLowerCase()))
    } else {
      setDeviceFwFiltered(devices)
    }
  }, [filterUpdated, selectedDevicesOption])

  return (
    <FirmwareContainer>
      <FirmwareHeader>
        <h3>{t('titleFirmware')}</h3>
        <div>
          <SelectDevicetoUpdateButton onClick={openModalSelected}>
            <RiCheckboxLine size={24} />
            {t('selectToUpdateButton')}
          </SelectDevicetoUpdateButton>
          <UploadButton onClick={openModal}>
            <RiFileUploadLine size={24} />
            {t('uploadButton')}
          </UploadButton>
          <NavRightPipe />
          <UploadButton onClick={() => navigate('/management/flasher')}>
            <RiCodeSSlashLine size={24} />
            {t('flashButton')}
          </UploadButton>
        </div>
      </FirmwareHeader>
      {
        combinedList.length > 0 ? <>
          <FirewareContent>
            {
              combinedList.map((items: FirmwareItem, index: number) => (
                <FileList key={items.fileName + index}>
                  <div>
                    <img src={BinIco} alt="Icon" />
                    <div>
                      <span>{items.fileName}</span>
                      <small>{items.fileSize}</small>
                      <div>
                        <small>{items.createDate.split(' ')[0]}</small>
                        <small>{items.createDate.split(' ')[1]}</small>
                      </div>
                    </div>
                  </div>
                  <div>
                    {
                      !items.fileName.startsWith('bootloader') && !items.fileName.startsWith('partition') &&
                      <div>
                        <button onClick={() => {
                          downloadFw(items.fileName);
                          getBootLoader();
                          getPartition();
                        }}>
                          <RiDownloadCloud2Line size={32} />
                        </button>
                        <button onClick={() => swalWithBootstrapButtons
                          .fire({
                            title: t('deleteFirmware'),
                            html: `${items.fileName}<br />${t('deleteFirmwareText')}`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: t('confirmButton'),
                            cancelButtonText: t('cancelButton'),
                            reverseButtons: false,
                          })
                          .then((result) => {
                            if (result.isConfirmed) {
                              deleteFw(items.fileName);
                            }
                          })}>
                          <RiDeleteBin2Line size={32} />
                        </button>
                      </div>
                    }
                  </div>
                </FileList>
              ))
            }
          </FirewareContent>
          <PaginitionContainer className="mt-3">
            <div></div>
            <Paginition
              currentPage={currentPage}
              cardsPerPage={cardsPerPage}
              changePage={changePage}
              displaySelectDevices={displaySelectDevices}
              displayedCards={combinedList}
              userdata={dataFiles}
            />
          </PaginitionContainer>
        </>
          :
          <PageLoading />
      }

      <Modal size="xl" show={modalSelected} onHide={closeModalSelected} scrollable>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('selectToUpdateButton')}
            </strong>
            <button onClick={closeModalSelected}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Modal.Body className="vh-100">
          <SelectFWFlex>
            <h3>{t('selectDeviceDrop')}</h3>
            <Select
              options={mapOptions<firmwareType, keyof firmwareType>(updatedDevData, 'fileName', 'fileName')}
              value={mapDefaultValue<firmwareType, keyof firmwareType>(updatedDevData, String(selectedDevicesOption), 'fileName', 'fileName')}
              onChange={handleSelectedandClearSelected}
              autoFocus={false}
              placeholder={t('selectOTA')}
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
          </SelectFWFlex>

          {selectedDevicesOption !== t('selectOTA') &&
            <>
              <CheckBoxFlex>
                <label>
                  <CheckBoxInput
                    type="checkbox"
                    checked={selectedDevices.length === devices.filter((items) =>
                      items.devSerial.substring(0, 1).toLowerCase().includes(selectedDevicesOption.substring(0, 1).toLowerCase())).length}
                    onChange={handleSelectAll}
                  />
                  {t('selectedAll')}
                </label>
                <label>
                  <CheckBoxInput
                    type="checkbox"
                    checked={filterUpdated}
                    onChange={filterFirmwareUpdated}
                  />
                  {t('deviceFilterNotUpdate')}
                </label>
              </CheckBoxFlex>
              <CheckBoxList>
                {
                  deviceFwFiltered
                    .filter((items) => items.devSerial.substring(0, 1).toLowerCase().includes(selectedDevicesOption.substring(0, 1).toLowerCase()))
                    .map((device, index) => (
                      <CheckBoxFlex key={index}>
                        <label>
                          <CheckBoxInput
                            type="checkbox"
                            value={device.devSerial}
                            checked={selectedDevices.includes(device.devSerial)}
                            onChange={handleCheckboxChange}
                          />
                          {device.devSerial}
                        </label>
                      </CheckBoxFlex>

                    ))
                }
              </CheckBoxList>
            </>
          }
        </Modal.Body>
        <Modal.Footer>
          <FormFlexBtn>
            <SelectDevicetoUpdateButton onClick={handleUpdate}>
              <RiUploadLine size={20} />
              {t('updateButton')}
            </SelectDevicetoUpdateButton>
          </FormFlexBtn>
        </Modal.Footer>
      </Modal>

      <Modal size={"xl"} show={showConsole} onHide={closeModalConsole}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModalConsole}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <ProgressBar $primary={flashProgress} />
            <TerminalComponent terminalRef={terminalRef} />
          </Modal.Body>
        </Form>
      </Modal>

      <Modal size={"lg"} show={show} onHide={closeModal}>
        <Modal.Header>
          <ModalHead>
            <strong>
              {t('uploadButton')}
            </strong>
            {/* <pre>{JSON.stringify(file, null, 2)}</pre> */}
            <button onClick={closeModal}>
              <RiCloseLine />
            </button>
          </ModalHead>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <RowChildren>
              <FileUploader
                handleChange={handleChange}
                onTypeError={handleError}
                name={file?.name}
                types={fileTypes}
                label={t('uploadLabel')}
                children={<UploadJSXStyle />}
                dropMessageStyle={{ backgroundColor: 'var(--main-color-opacity2)' }}
                onDraggingStateChange={handleDrag} />
            </RowChildren>
          </Modal.Body>
          <Modal.Footer>
            <FormFlexBtn>
              <FormBtn type="submit">
                {t('uploadButton')}
              </FormBtn>
            </FormFlexBtn>
          </Modal.Footer>
        </Form>
      </Modal>
    </FirmwareContainer>
  )
}
