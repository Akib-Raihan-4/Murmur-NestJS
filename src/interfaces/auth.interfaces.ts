export interface ISignUpData {
  username: string
  name: string
  password: string
}

export interface ISignInData {
  username: string
  password: string
}

export interface IAuthResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    user: {
      id: number
      username: string
      name: string
    }
  }
}
