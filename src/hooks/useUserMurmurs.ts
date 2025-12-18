import { useEffect, useState } from 'react'
import { murmurService } from '../services/api'
import { IMurmur, ITimelineResponse } from '../interfaces/murmur.interfaces'

export const useUserMurmurs = (page: number = 1) => {
  const [murmurs, setMurmurs] = useState<IMurmur[]>([])
  const [pagination, setPagination] = useState<
    ITimelineResponse['pagination'] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMurmurs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await murmurService.getUserMurmurs(page)
      setMurmurs(response.data.data)
      setPagination(response.data.pagination)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch your murmurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMurmurs()
  }, [page])

  return {
    murmurs,
    setMurmurs,
    pagination,
    loading,
    error,
    refetch: fetchMurmurs,
  }
}
