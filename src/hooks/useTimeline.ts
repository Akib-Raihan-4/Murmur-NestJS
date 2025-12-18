import { useState, useEffect, useCallback } from 'react'
import { murmurService } from '../services/api'
import { IMurmur, ITimelineResponse } from '../interfaces/murmur.interfaces'

export const useTimeline = (page: number = 1) => {
  const [murmurs, setMurmurs] = useState<IMurmur[]>([])
  const [pagination, setPagination] = useState<
    ITimelineResponse['pagination'] | null
  >(null)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTimeline = useCallback(async () => {
    try {
      setIsFetching(true)
      setError(null)

      const res = await murmurService.getTimeline(page)

      setMurmurs(res.data.data)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch timeline')
    } finally {
      setIsFetching(false)
      setIsInitialLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  return {
    murmurs,
    pagination,
    isInitialLoading,
    isFetching,
    error,
    setMurmurs,
    refetch: fetchTimeline,
  }
}
