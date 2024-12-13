type TmsDeviceLogType = {
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

export type { TmsDeviceLogType }