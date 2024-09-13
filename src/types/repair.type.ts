import { devicesType } from "./device.type"

type repairType = {
  repairId: string,
  repairNo: number,
  devId: string,
  repairInfo: string,
  repairInfo1: string,
  repairInfo2: string,
  repairLocation: string,
  ward: string,
  repairDetails: string,
  telePhone: string,
  repairStatus: string,
  warrantyStatus: string,
  comment: string,
  baseStatus: string,
  createAt: string,
  updateAt: string,
  device: devicesType
}

export type { repairType }