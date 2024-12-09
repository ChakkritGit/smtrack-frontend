import { hospitalsType } from "./hospital.type"

type usersType = {
  userId: string,
  wardId: string,
  userName: string,
  userStatus: boolean,
  role: UserRole,
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

type UserProfileType = {
  display?: string,
  id: string,
  pic: string,
  role: string,
  status: boolean,
  username: string,
  ward: {
    hospital: {
      hosName: string,
      hosPic?: string,
      id: string
    },
    id: string,
    wardName: string
  }
}

export enum UserRole {
  SUPER = 'SUPER',
  SERVICE = 'SERVICE',
  ADMIN = 'ADMIN',
  USER = 'USER',
  LEGACY_ADMIN = 'LEGACY_ADMIN',
  LEGACY_USER = 'LEGACY_USER',
  GUEST = 'GUEST',
}

export type { usersType, UserProfileType }
