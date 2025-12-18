import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useUserMurmurs } from '../hooks/useUserMurmurs'
import { murmurService } from '../services/api'

export const ProfilePage: React.FC = () => {
  const { token } = useAuth()
  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useProfile(token)

  const [currentPage, setCurrentPage] = useState(1)
  const {
    murmurs,
    setMurmurs,
    pagination,
    loading: murmursLoading,
    error: murmursError,
    refetch,
  } = useUserMurmurs(currentPage)

  const [likeLoading, setLikeLoading] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

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
      refetch()
    } finally {
      setLikeLoading(null)
    }
  }

  const handleDeleteMurmur = async () => {
    if (!deleteTargetId) return

    try {
      setDeleteLoading(deleteTargetId)
      await murmurService.deleteMurmur(deleteTargetId)
      await refetch()
      setDeleteTargetId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteLoading(null)
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

  if (profileLoading) {
    return <div className="py-12 text-center">Loading profile…</div>
  }

  if (profileError) {
    return <div className="py-12 text-center text-red-600">{profileError}</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="mb-4">
          <h2 className="text-sm text-gray-500 uppercase">Username</h2>
          <p className="text-lg font-medium">@{profile?.username}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500 uppercase">Full Name</h2>
          <p className="text-lg font-medium">{profile?.name}</p>
        </div>
      </div>

      {/* Murmurs */}
      <h2 className="text-2xl font-bold mb-4">My Murmurs</h2>

      {murmursLoading ? (
        <div className="py-12 text-center">Loading murmurs…</div>
      ) : murmursError ? (
        <div className="text-center text-red-600">{murmursError}</div>
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
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {formatDate(m.createdAt)}
                  </span>
                  <button
                    onClick={() => setDeleteTargetId(m.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mb-4 whitespace-pre-wrap">{m.text}</p>

              <button
                onClick={() => handleToggleLike(m.id)}
                disabled={likeLoading === m.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  m.isLiked
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-50 text-gray-600'
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
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Delete Murmur</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this murmur?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMurmur}
                disabled={deleteLoading === deleteTargetId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {deleteLoading === deleteTargetId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
