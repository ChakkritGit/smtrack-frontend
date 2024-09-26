import { ChangeEventHandler, MouseEventHandler } from "react"

// userComponent
interface cardType {
  keyindex: number,
  userId: string,
  displayName: string,
  userName: string,
  userLevel: string,
  userPic: string,
  hosId: string,
  userStatus: boolean,
  wardId: string
}
// closeUserComponent

// filterComponent
type MyComponentFilters = {
  filterText: string,
  onFilter: ChangeEventHandler<HTMLInputElement> | undefined,
  onClear: MouseEventHandler<HTMLButtonElement> | undefined,
  onState: string
}
// closeFilterComponent

// countProblemComponent
type countProblem = {
  probe: number,
  door: number,
  connect: number,
  ac: number,
  sd: number,
  adjust: number,
  repair: number,
  warranty: number
}
// closeCountProblemComponent

// dataTableLogExportComponent
type dataTableLog = {
  No: number,
  DeviceSN: string,
  DeviceName: string,
  TemeratureMax: number,
  TemeratureMin: number,
  Temperature: number,
  Humidity: number,
  Door1: string,
  Door2: string,
  Door3: string,
  Connectivity: string,
  Plug: string,
  Battery: string,
  Time: string
}
// closeDataTableLogExportComponent

// jwtToken
type jwtToken = {
  hosId: string
  iat: number
  userId: string
  userLevel: string
}
// jwtTokenComponent

type FilterText = 'probe' | 'door' | 'connect' | 'plug' | 'sd' | 'adjust' | 'repair' | 'warranty'

type cardFilter = {
  id: number
  title: string
  count: number
  times: string
  svg: JSX.Element
  cardname: string
  active: boolean
}

type socketResponseType = {
  device: string,
  message: string,
  hospital: string,
  time: string
}

// type DeviceEventResponseType = {

// }

type firmwareType = {
  fileName: string,
  fileSize: string,
  createDate: string
}

export type { cardType, MyComponentFilters, countProblem, dataTableLog, jwtToken, cardFilter, socketResponseType, firmwareType, FilterText }