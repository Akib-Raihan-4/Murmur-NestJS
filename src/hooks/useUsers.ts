import { useState, useEffect, useCallback } from 'react'
import { userService } from '../services/api'
import { IUsersListResponse } from '../interfaces/user.interfaces'

export const useUsers = (page: number = 1) => {
  const [users, setUsers] = useState<IUsersListResponse['data']>([])
  const [pagination, setPagination] = useState<
    IUsersListResponse['pagination'] | null
  >(null)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setIsFetching(true)
      setError(null)

      const response = await userService.getUsers(page)

      setUsers(response.data.data)
      setPagination(response.data.pagination)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch users')
    } finally {
      setIsFetching(false)
      setIsInitialLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    pagination,
    isInitialLoading,
    isFetching,
    error,
    refetch: fetchUsers,
  }
}
