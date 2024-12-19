import { hospitalsType } from "./hospital.type"

type wardsType = {
  createAt: string,
  hosId: string,
  id: string,
  updateAt: string,
  wardName: string,
  wardSeq: number,
  hospital: hospitalsType
}

export type { wardsType }