type TmsDeviceType = {
  sn: string,
  name: string,
  ward: string,
  hospital: string,
  maxTemp: number,
  minTemp: number,
  adjTemp: number,
  record: number,
  log: TmsLogType[]
}

type TmsLogType = {
  id: string,
  mcuId: string,
  internet: boolean,
  door: boolean,
  plugin: boolean,
  tempValue: number,
  realValue: number,
  date: string,
  time: string,
  isAlert: boolean,
  createdAt: string,
  updatedAt: string
}

type TmsCountType = {
  temp: number,
  door: number,
  plug: number
}

type FetchDeviceType = {
  total: number,
  devices: TmsDeviceType[]
}

export type { TmsDeviceType, FetchDeviceType, TmsCountType, TmsLogType }