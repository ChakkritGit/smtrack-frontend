import { hospitalsType } from "./hospital.type"

type wardsType = {
  wardId: string,
  wardName: string,
  wardSeq: number,
  hosId: string,
  createAt: string,
  updateAt: string,
  hospital: hospitalsType
}

export type { wardsType }