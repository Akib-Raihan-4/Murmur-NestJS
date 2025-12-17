import { useState, useEffect } from 'react'
import { authService } from '../services/api'
import { IUserProfileResponse } from '../interfaces/user.interfaces'

export const useProfile = (token: string | null) => {
  const [profile, setProfile] = useState<IUserProfileResponse['data'] | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await authService.getProfile()
        setProfile(response.data.data)
      } catch (err) {
        setError('Failed to fetch profile')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  return { profile, loading, error }
}
