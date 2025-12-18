import React, { useEffect, useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { userService } from '../services/api'
import { IUsersListResponse } from '../interfaces/user.interfaces'

type User = IUsersListResponse['data'][number]

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { users, pagination, isInitialLoading, isFetching, error, refetch } =
    useUsers(currentPage)

  const [localUsers, setLocalUsers] = useState<User[]>([])
  const [followLoading, setFollowLoading] = useState<number | null>(null)

  useEffect(() => {
    setLocalUsers(users)
  }, [users])

  const handleFollow = async (userId: number, isFollowing: boolean) => {
    setFollowLoading(userId)

    setLocalUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              isFollowing: !isFollowing,
              followersCount: isFollowing
                ? user.followersCount - 1
                : user.followersCount + 1,
            }
          : user,
      ),
    )

    try {
      if (isFollowing) {
        await userService.unfollowUser(userId)
      } else {
        await userService.followUser(userId)
      }
    } catch (err) {
      console.error('Follow/Unfollow failed:', err)
      refetch()
    } finally {
      setFollowLoading(null)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Users</h1>

      {isFetching && (
        <div className="text-sm text-gray-500 mb-4">Updating…</div>
      )}

      <div className="space-y-4">
        {localUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h3>
              <p className="text-gray-600">@{user.username}</p>
              <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                <span>{user.followersCount} followers</span>
                <span>{user.followingCount} following</span>
              </div>
            </div>

            <button
              onClick={() => handleFollow(user.id, user.isFollowing)}
              disabled={followLoading === user.id}
              className={`px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                user.isFollowing
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {followLoading === user.id
                ? 'Loading...'
                : user.isFollowing
                  ? 'Unfollow'
                  : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
