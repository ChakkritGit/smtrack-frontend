interface DevicesType {
  total: number,
  devices: HomeDeviceType[]
}

type DeviceType = {
  id: string,
  ward: string,
  hospital: string,
  staticName: string,
  name?: string,
  status: boolean,
  seq: number,
  location?: string,
  position?: string,
  positionPic?: string,
  installDate: string,
  firmware: string,
  remark?: string,
  online: boolean,
  tag?: string,
  createAt: string,
  updateAt: string
}

type ProbeType = {
  id: "5e86b263-39c2-40f9-a09e-2b2e089f42f3",
  sn: "test",
  name: null,
  type: null,
  channel: "1",
  tempMin: 0,
  tempMax: 37,
  humiMin: 0,
  humiMax: 100,
  tempAdj: 0,
  humiAdj: 0,
  stampTime: null,
  doorQty: 1,
  position: null,
  muteAlarmDuration: null,
  doorSound: true,
  doorAlarmTime: null
  muteDoorAlarmDuration: null,
  notiDelay: 0,
  notiToNormal: true,
  notiMobile: true,
  notiRepeat: 1,
  firstDay: "OFF",
  secondDay: "OFF",
  thirdDay: "OFF",
  firstTime: "0000",
  secondTime: "0000",
  thirdTime: "0000",
  createAt: "2024-12-24T15:15:28.000Z",
  updateAt: "2024-12-24T15:15:28.000Z"
}

type ConfigType = {
  id: "1ce6729c-7078-419c-a113-a251d76722bc",
  sn: "test",
  dhcp: true,
  ip: null,
  mac: null,
  subnet: null,
  gateway: null,
  dns: null,
  dhcpEth: null,
  ipEth: null,
  macEth: null,
  subnetEth: null,
  gatewayEth: null,
  dnsEth: null,
  ssid: "RDE2_2.4GHz",
  password: "rde05012566",
  simSP: null,
  email1: null,
  email2: null,
  email3: null,
  hardReset: "0200",
  createAt: "2024-12-24T15:15:28.000Z",
  updateAt: "2024-12-24T15:15:28.000Z"
}

type LogType = {
  id: "e82d240d-dcdf-42ec-a6be-95785b59abc",
  serial: "test",
  temp: 10.1,
  tempDisplay: 10,
  humidity: 69,
  humidityDisplay: 69,
  sendTime: "2024-12-24T15:17:13.827Z",
  plug: true,
  door1: false,
  door2: false,
  door3: false,
  internet: false,
  probe: "1",
  battery: 0,
  tempInternal: 0,
  extMemory: false,
  createAt: "2024-12-24T15:17:13.827Z",
  updateAt: "2024-12-24T15:17:13.827Z"
}

type WarrantyType = {
  expire: string
}


interface HomeDeviceType extends DeviceType {
  probe: ProbeType[],
  config: ConfigType,
  log: LogType[],
  warranty: WarrantyType[]
}

export type { DevicesType, DeviceType, HomeDeviceType, ProbeType }