import React, { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { userService } from '../services/api'
import { UserDetailPage } from './UserDetailPage'

export const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { users, pagination, isInitialLoading, isFetching, error, refetch } =
    useUsers(currentPage)
  const [followLoading, setFollowLoading] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const handleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      setFollowLoading(userId)
      if (isFollowing) {
        await userService.unfollowUser(userId)
      } else {
        await userService.followUser(userId)
      }
      await refetch()
    } catch (err) {
      console.error('Follow/Unfollow failed:', err)
    } finally {
      setFollowLoading(null)
    }
  }

  if (selectedUserId) {
    return (
      <UserDetailPage
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    )
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
          >
            <div
              onClick={() => setSelectedUserId(user.id)}
              className="cursor-pointer flex-1"
            >
              <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
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
            disabled={currentPage === 1 || isFetching}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!pagination.hasNextPage || isFetching}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
