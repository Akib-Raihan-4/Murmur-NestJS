import React, { useState } from 'react'
import { useUserDetail } from '../hooks/useUserDetail'
import { useUserDetailMurmurs } from '../hooks/useUserDetailMurmurs'
import { userService, murmurService } from '../services/api'

interface UserDetailPageProps {
  userId: number
  onBack: () => void
}

export const UserDetailPage: React.FC<UserDetailPageProps> = ({
  userId,
  onBack,
}) => {
  const {
    user,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useUserDetail(userId)

  const [currentPage, setCurrentPage] = useState(1)
  const {
    murmurs,
    setMurmurs,
    pagination,
    loading: murmursLoading,
    error: murmursError,
    refetch: refetchMurmurs,
  } = useUserDetailMurmurs(userId, currentPage)

  const [followLoading, setFollowLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState<number | null>(null)

  const handleFollowToggle = async () => {
    if (!user) return

    try {
      setFollowLoading(true)
      if (user.isFollowing) {
        await userService.unfollowUser(userId)
      } else {
        await userService.followUser(userId)
      }
      await refetchUser()
    } catch (err) {
      console.error('Follow/Unfollow failed:', err)
    } finally {
      setFollowLoading(false)
    }
  }

  const handleToggleLike = async (murmurId: number) => {
    setLikeLoading(murmurId)

    setMurmurs((prev) =>
      prev.map((m) =>
        m.id === murmurId
          ? {
              ...m,
              isLiked: !m.isLiked,
              likesCount: m.isLiked ? m.likesCount - 1 : m.likesCount + 1,
            }
          : m,
      ),
    )

    try {
      await murmurService.toggleLike(murmurId)
    } catch (err) {
      console.error(err)
      refetchMurmurs()
    } finally {
      setLikeLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const diff = Math.floor((Date.now() - date.getTime()) / 1000)

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    })
  }

  if (userLoading) {
    return <div className="py-12 text-center">Loading user details…</div>
  }

  if (userError || !user) {
    return (
      <div className="py-12 text-center text-red-600">
        {userError || 'User not found'}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Users
      </button>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-xl text-gray-600 mb-4">@{user.username}</p>

            <div className="flex space-x-6">
              <div>
                <span className="font-bold text-lg">{user.followersCount}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold text-lg">{user.followingCount}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
              user.isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {followLoading
              ? 'Loading...'
              : user.isFollowing
                ? 'Unfollow'
                : 'Follow'}
          </button>
        </div>
      </div>

      {/* User's Murmurs */}
      <h2 className="text-2xl font-bold mb-4">Murmurs</h2>

      {murmursLoading ? (
        <div className="py-12 text-center">Loading murmurs…</div>
      ) : murmursError ? (
        <div className="text-center text-red-600">{murmursError}</div>
      ) : murmurs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">
            This user hasn't posted any murmurs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {murmurs.map((m) => (
            <div key={m.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between mb-2">
                <div>
                  <div className="font-semibold">{m.author.name}</div>
                  <div className="text-sm text-gray-500">
                    @{m.author.username}
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(m.createdAt)}
                </span>
              </div>

              <p className="mb-4 whitespace-pre-wrap">{m.text}</p>

              <button
                onClick={() => handleToggleLike(m.id)}
                disabled={likeLoading === m.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition disabled:opacity-50 ${
                  m.isLiked
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={m.isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{m.likesCount}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
