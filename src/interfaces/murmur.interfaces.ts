export interface IMurmur {
  id: number
  text: string
  createdAt: string
  author: {
    id: number
    username: string
    name: string
  }
  likesCount: number
  isLiked: boolean
}

export interface ITimelineResponse {
  success: boolean
  message: string
  data: IMurmur[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    perPage: number
    hasNextPage: boolean
  }
}

export interface IToggleLikeResponse {
  success: boolean
  message: string
  data: {
    likesCount: number
    isLiked: boolean
  }
}

export interface ICreateMurmurRequest {
  text: string
}

export interface ICreateMurmurResponse {
  success: boolean
  message: string
  data: IMurmur
}
