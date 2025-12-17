import { IUser } from '../interfaces/user.interfaces'

export interface IAuthContextType {
  user: IUser | null
  token: string | null
  login: (token: string, user: IUser) => void
  logout: () => void
  isAuthenticated: boolean
}
