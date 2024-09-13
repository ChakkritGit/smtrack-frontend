import { CookieType } from "../types/cookie.type"
import Cookies, { CookieSetOptions } from "universal-cookie"
import CryptoJS from "crypto-js"
import { Schedule, ScheduleHour, ScheduleMinute } from "../types/config.type"

export const getDateNow = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = ("0" + (date.getMonth() + 1)).slice(-2)
  let day = ("0" + date.getDate()).slice(-2)
  return String(year + '-' + month + '-' + day)
}

export const resetActive = {
  probe: false,
  door: false,
  connect: false,
  plug: false,
  sd: false,
  adjust: false,
  repair: false,
  warranty: false
}

export const cookies = new Cookies()

export const accessToken = (localDataObject: CookieType) => CryptoJS.AES.encrypt(JSON.stringify(localDataObject), `${import.meta.env.VITE_APP_SECRETKEY}`)
export const decodeCookieObject = (cookieEncode: string) => CryptoJS.AES.decrypt(cookieEncode, `${import.meta.env.VITE_APP_SECRETKEY}`)

const expiresDate = () => {
  // ตั้งค่า cookies พร้อม expiration date ที่ไกลในอนาคต
  const expirationDate = new Date()
  return expirationDate.setHours(expirationDate.getHours() + 240) // 8 วันนับจากวันนี้
}

export const cookieOptions: CookieSetOptions = {
  path: '/',
  expires: new Date(expiresDate()), // 8 วันนับจากวันนี้
  maxAge: Number(import.meta.env.VITE_APP_MAXAGE * 24 * 60 * 60),
  domain: import.meta.env.VITE_APP_NODE_ENV === 'development' ? 'localhost' : import.meta.env.VITE_APP_DOMAIN, // ถ้าไม่ต้องการใช้ domain ให้คอมเมนต์หรือเอาบรรทัดนี้ออก
  secure: true, // ใช้ secure cookies เฉพาะเมื่อทำงานบน HTTPS
  httpOnly: false, // กำหนดเป็น true ถ้าต้องการให้ cookies สามารถเข้าถึงได้จากเซิร์ฟเวอร์เท่านั้น
  sameSite: true // ตัวเลือก 'strict', 'lax', หรือ 'none'
}

export const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const image: HTMLImageElement = new Image()
      image.src = e.target?.result as string

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const maxDimensions = { width: 720, height: 720 }
        const scaleFactor = Math.min(maxDimensions.width / image.width, maxDimensions.height / image.height)

        canvas.width = image.width * scaleFactor
        canvas.height = image.height * scaleFactor

        const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
        context?.drawImage(image, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob: Blob | null) => {
            const resizedFile = new File([blob as Blob], file.name, { type: file.type })
            resolve(resizedFile)
          },
          file.type,
          1 // JPEG quality, 1 is maximum
        )
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export const scheduleDayArray: Schedule[] = [
  {
    scheduleKey: 'Mon',
    scheduleLabel: 'Mon'
  },
  {
    scheduleKey: 'Tue',
    scheduleLabel: 'Tue'
  },
  {
    scheduleKey: 'Wed',
    scheduleLabel: 'Wed'
  },
  {
    scheduleKey: 'Thu',
    scheduleLabel: 'Thu'
  },
  {
    scheduleKey: 'Fri',
    scheduleLabel: 'Fri'
  },
  {
    scheduleKey: 'Sat',
    scheduleLabel: 'Sat'
  },
  {
    scheduleKey: 'Sun',
    scheduleLabel: 'Sun'
  },
]

export const scheduleTimeArray: ScheduleHour[] = [
  {
    scheduleHourKey: '00',
    scheduleHourLabel: '00'
  },
  {
    scheduleHourKey: '01',
    scheduleHourLabel: '01'
  },
  {
    scheduleHourKey: '02',
    scheduleHourLabel: '02'
  },
  {
    scheduleHourKey: '03',
    scheduleHourLabel: '03'
  },
  {
    scheduleHourKey: '04',
    scheduleHourLabel: '04'
  },
  {
    scheduleHourKey: '05',
    scheduleHourLabel: '05'
  },
  {
    scheduleHourKey: '06',
    scheduleHourLabel: '06'
  },
  {
    scheduleHourKey: '07',
    scheduleHourLabel: '07'
  },
  {
    scheduleHourKey: '08',
    scheduleHourLabel: '08'
  },
  {
    scheduleHourKey: '09',
    scheduleHourLabel: '09'
  },
  {
    scheduleHourKey: '10',
    scheduleHourLabel: '10'
  },
  {
    scheduleHourKey: '11',
    scheduleHourLabel: '11'
  },
  {
    scheduleHourKey: '12',
    scheduleHourLabel: '12'
  },
  {
    scheduleHourKey: '13',
    scheduleHourLabel: '13'
  },
  {
    scheduleHourKey: '14',
    scheduleHourLabel: '14'
  },
  {
    scheduleHourKey: '15',
    scheduleHourLabel: '15'
  },
  {
    scheduleHourKey: '16',
    scheduleHourLabel: '16'
  },
  {
    scheduleHourKey: '17',
    scheduleHourLabel: '17'
  },
  {
    scheduleHourKey: '18',
    scheduleHourLabel: '18'
  },
  {
    scheduleHourKey: '19',
    scheduleHourLabel: '19'
  },
  {
    scheduleHourKey: '20',
    scheduleHourLabel: '20'
  },
  {
    scheduleHourKey: '21',
    scheduleHourLabel: '21'
  },
  {
    scheduleHourKey: '22',
    scheduleHourLabel: '22'
  },
  {
    scheduleHourKey: '23',
    scheduleHourLabel: '23'
  }
]

export const scheduleMinuteArray: ScheduleMinute[] = [
  {
    scheduleMinuteKey: '00',
    scheduleMinuteLabel: '00'
  },
  {
    scheduleMinuteKey: '10',
    scheduleMinuteLabel: '10'
  },
  {
    scheduleMinuteKey: '20',
    scheduleMinuteLabel: '20'
  },
  {
    scheduleMinuteKey: '30',
    scheduleMinuteLabel: '30'
  },
  {
    scheduleMinuteKey: '40',
    scheduleMinuteLabel: '40'
  },
  {
    scheduleMinuteKey: '50',
    scheduleMinuteLabel: '50'
  },
  // {
  //   scheduleMinuteKey: '60',
  //   scheduleMinuteLabel: '60'
  // }
]

export const getFormattedDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export const formattedDate = getFormattedDate()
export const yearMonth = formattedDate.substring(0, 6)