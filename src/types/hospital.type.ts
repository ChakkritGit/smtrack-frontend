import { wardsType } from "./ward.type"

type hospitalsType = {
  hosId: string,
  hosName: string,
  hosAddress: string,
  hosTelephone: string,
  userContact: string,
  userTelePhone: string,
  hosLatitude: string,
  hosLongitude: string,
  hosPic: string,
  createAt: string,
  updateAt: string,
  ward: wardsType[]
}

export type { hospitalsType }