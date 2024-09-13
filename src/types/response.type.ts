type responseType<T> = {
  message: string,
  success: boolean,
  data: T
}

// logInResponse
type LoginResponse = {
  token: string,
  userId: string,
  hosId: string,
  wardId: string,
  userLevel: string,
  hosPic: string,
  hosName: string,
  userStatus: boolean,
  userName: string,
  displayName: string,
  userPic: string
}
// closrLogInResponse

export type { responseType, LoginResponse }