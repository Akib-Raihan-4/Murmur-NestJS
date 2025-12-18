import { useState, useEffect, useCallback } from 'react'
import { userService } from '../services/api'
import { IMurmur, ITimelineResponse } from '../interfaces/murmur.interfaces'

export const useUserDetailMurmurs = (userId: number, page: number = 1) => {
  const [murmurs, setMurmurs] = useState<IMurmur[]>([])
  const [pagination, setPagination] = useState<
    ITimelineResponse['pagination'] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMurmurs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUserMurmurs(userId, page)
      setMurmurs(response.data.data)
      setPagination(response.data.pagination)
    } catch (err) {
      setError('Failed to fetch murmurs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId, page])

  useEffect(() => {
    fetchMurmurs()
  }, [fetchMurmurs])

  return {
    murmurs,
    setMurmurs,
    pagination,
    loading,
    error,
    refetch: fetchMurmurs,
  }
}
