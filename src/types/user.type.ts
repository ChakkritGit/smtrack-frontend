import { hospitalsType } from "./hospital.type"

type usersType = {
  userId: string,
  wardId: string,
  userName: string,
  userStatus: boolean,
  userLevel: string,
  displayName: string,
  userPic: string,
  comment: null,
  createBy: string,
  createAt: string,
  updateAt: string
  ward: {
    wardName: string,
    hosId: string,
    hospital: hospitalsType
  }
}

export type { usersType }
