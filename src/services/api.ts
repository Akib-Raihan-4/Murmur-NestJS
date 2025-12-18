import axios from 'axios'
import {
  IAuthResponse,
  ISignInData,
  ISignUpData,
} from '../interfaces/auth.interfaces'
import { IUserProfileResponse } from '../interfaces/user.interfaces'

const API_BASE_URL = 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  signUp: (data: ISignUpData) => api.post<IAuthResponse>('/auth/signup', data),
  signIn: (data: ISignInData) => api.post<IAuthResponse>('/auth/signin', data),
  getProfile: () => api.get<IUserProfileResponse>('/users/me'),
}
