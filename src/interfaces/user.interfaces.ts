export interface IUser {
  id: number
  username: string
  name: string
  followersCount?: number
  followingCount?: number
  isFollowing?: boolean
}

export interface IUserProfileResponse {
  success: boolean
  message: string
  data: {
    id: number
    username: string
    name: string
    followersCount: number
    followingCount: number
    isFollowing: boolean
  }
}

export interface IUsersListResponse {
  success: boolean
  message: string
  data: Array<{
    id: number
    username: string
    name: string
    followersCount: number
    followingCount: number
    isFollowing: boolean
  }>
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    perPage: number
    hasNextPage: boolean
  }
}
