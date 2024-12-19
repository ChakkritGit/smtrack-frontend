import { wardsType } from "./ward.type"

type hospitalsType = {
  createAt: string,
  hosAddress?: string,
  hosLatitude?: string,
  hosLongitude?: string,
  hosName: string,
  hosPic?: string,
  hosSeq: number,
  hosTel?: string,
  id: string,
  updateAt: string,
  userContact?: string,
  userTel?: string,
  ward: wardsType[]
}

export type { hospitalsType }