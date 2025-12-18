import { useState, useEffect, useCallback } from 'react'
import { userService } from '../services/api'
import { IUserProfileResponse } from '../interfaces/user.interfaces'

export const useUserDetail = (userId: number) => {
  const [user, setUser] = useState<IUserProfileResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUserById(userId)
      setUser(response.data.data)
    } catch (err) {
      setError('Failed to fetch user details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return { user, loading, error, refetch: fetchUser }
}
