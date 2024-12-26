type usersType = {
  display: string,
  id: string,
  pic: string,
  role: UserRole,
  status: boolean,
  username: string,
  ward: {
    hosId: string,
    id: string,
    wardName: string
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
