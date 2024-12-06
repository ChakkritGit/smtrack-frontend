import { jwtToken, socketResponseType } from "./component.type"
import { CookieType } from "./cookie.type"
import { devicesType } from "./device.type"
import { hospitalsType } from "./hospital.type"
import { notificationType } from "./notification.type"
import { probeType } from "./probe.type"
import { TmsDeviceType } from "./tms.type"
import { UserProfileType, usersType } from "./user.type"
import { wardsType } from "./ward.type"

interface payloadError {
  error: {
    message: string
  }
}

interface DataArrayStore extends ArrayStore {
  arrayLoading: boolean,
  arrayError: string
}

type DeviceState = {
  devices: devicesType[],
  devicesLoading: boolean,
  devicesError: string
}

type TmsDeviceState = {
  devices: TmsDeviceType[],
  devicesLoading: boolean,
  devicesError: string
}

type LogState = {
  devicesLogs: devicesType,
  logLoading: boolean,
  logError: string
}

type UtilsStateStore = {
  deviceId: string,
  Serial: string,
  socketData: socketResponseType | null,
  // deviceEvent: DeviceEventResponseType | null,
  searchQuery: string,
  expand: boolean,
  showAside: boolean,
  tokenDecode: jwtToken,
  soundMode: boolean,
  popUpMode: boolean,
  hosId: string,
  wardId: string,
  cookieEncode: string,
  cookieDecode: CookieType,
  userProfile?: UserProfileType,
  showAlert: boolean,
  notiData: notificationType[],
  reFetchData: boolean,
  onFilter: boolean,
  transparent: boolean,
  isTms: boolean
}

type DeviceStateStore = {
  devices: DeviceState,
  logs: LogState,
  utilsState: UtilsStateStore,
  arraySlice: DataArrayStore,
  user: UserState,
  probe: ProbeState
  tmsDevice: TmsDeviceState
}

type ArrayStore = {
  device: {
    devicesFilter: devicesType[]
  },
  hospital: {
    hospitalsData: hospitalsType[]
  },
  ward: {
    wardData: wardsType[]
  }
}

type UserState = {
  userData: usersType[],
  userLoading: boolean,
  userError: string,
}

type ProbeState = {
  probeData: probeType[],
  probeLoading: boolean,
  probeError: string,
}

export type {
  DeviceState, LogState, DataArrayStore,
  UtilsStateStore, DeviceStateStore, ArrayStore, payloadError, UserState,
  ProbeState, TmsDeviceState
}