type responseType<T> = {
  message: string,
  success: boolean,
  data: T
}

// logInResponse
type LoginResponse = {
  hosId: string,
  refreshToken: string,
  token: string,
  id: string,
  wardId: string,
}
// closrLogInResponse

export type { responseType, LoginResponse }