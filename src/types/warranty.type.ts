import { devicesType } from "./device.type"

type warrantyType = {
  warrId: string,
  devName?: string | undefined,
  productName?: string | undefined,
  productModel?: string | undefined,
  installDate?: string | undefined,
  customerName?: string | undefined,
  customerAddress?: string | undefined,
  saleDept?: string | undefined,
  invoice?: string | undefined,
  expire: string,
  device: devicesType
}

export type { warrantyType }