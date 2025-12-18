import { useState, useEffect, useCallback } from 'react'
import { murmurService } from '../services/api'
import { IMurmur } from '../interfaces/murmur.interfaces'

export const useMurmurDetail = (murmurId: number) => {
  const [murmur, setMurmur] = useState<IMurmur | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMurmur = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await murmurService.getMurmurById(murmurId)
      setMurmur(response.data.data)
    } catch (err) {
      setError('Failed to fetch murmur')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [murmurId])

  useEffect(() => {
    fetchMurmur()
  }, [fetchMurmur])

  return { murmur, setMurmur, loading, error, refetch: fetchMurmur }
}
