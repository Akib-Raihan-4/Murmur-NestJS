import axios from 'axios'
import {
  IAuthResponse,
  ISignInData,
  ISignUpData,
} from '../interfaces/auth.interfaces'
import {
  IUserProfileResponse,
  IUsersListResponse,
} from '../interfaces/user.interfaces'
import {
  ICreateMurmurRequest,
  ICreateMurmurResponse,
  ITimelineResponse,
  IToggleLikeResponse,
} from '../interfaces/murmur.interfaces'

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

export const userService = {
  getUsers: (page: number = 1, limit: number = 10) =>
    api.get<IUsersListResponse>(`/users?page=${page}&limit=${limit}`),
  followUser: (userId: number) => api.post(`/follow/${userId}`),
  unfollowUser: (userId: number) => api.delete(`/follow/${userId}`),
  getUserById: (userId: number) =>
    api.get<IUserProfileResponse>(`/users/${userId}`),
  getUserMurmurs: (userId: number, page: number = 1, limit: number = 10) =>
    api.get<ITimelineResponse>(
      `/users/${userId}/murmurs?page=${page}&limit=${limit}`,
    ),
}

export const murmurService = {
  getTimeline: (page: number = 1, limit: number = 10) =>
    api.get<ITimelineResponse>(`/murmur/timeline?page=${page}&limit=${limit}`),
  toggleLike: (murmurId: number) =>
    api.post<IToggleLikeResponse>(`/murmur/${murmurId}/toggle-like`),
  createMurmur: (data: ICreateMurmurRequest) =>
    api.post<ICreateMurmurResponse>('/murmur', data),
  getUserMurmurs: (page: number = 1, limit: number = 10) =>
    api.get<ITimelineResponse>(`/murmur?page=${page}&limit=${limit}`),
  deleteMurmur: (murmurId: number) => api.delete(`/murmur/${murmurId}`),
  getMurmurById: (murmurId: number) =>
    api.get<ICreateMurmurResponse>(`/murmur/${murmurId}`),
}
