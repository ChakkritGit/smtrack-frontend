type notificationType = {
  notiId: string,
  devSerial: string,
  notiDetail: string,
  notiStatus: boolean,
  createAt: string,
  updateAt: string,
  device: {
    devId: string,
    devName: string,
    devSerial: string,
    devDetail: string
  }
}

export type { notificationType }