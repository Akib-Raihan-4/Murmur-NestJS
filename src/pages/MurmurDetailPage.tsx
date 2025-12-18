import React, { useState } from 'react'
import { useMurmurDetail } from '../hooks/useMurmurDetail'
import { murmurService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface MurmurDetailPageProps {
  murmurId: number
  onBack: () => void
}

export const MurmurDetailPage: React.FC<MurmurDetailPageProps> = ({
  murmurId,
  onBack,
}) => {
  const { user: currentUser } = useAuth()
  const { murmur, setMurmur, loading, error, refetch } =
    useMurmurDetail(murmurId)
  const [likeLoading, setLikeLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleToggleLike = async () => {
    if (!murmur) return

    setLikeLoading(true)

    setMurmur({
      ...murmur,
      isLiked: !murmur.isLiked,
      likesCount: murmur.isLiked
        ? murmur.likesCount - 1
        : murmur.likesCount + 1,
    })

    try {
      await murmurService.toggleLike(murmurId)
    } catch (err) {
      console.error(err)
      refetch()
    } finally {
      setLikeLoading(false)
    }
  }

  const handleDeleteMurmur = async () => {
    try {
      setDeleteLoading(true)
      await murmurService.deleteMurmur(murmurId)
      onBack()
    } catch (err) {
      console.error(err)
      alert('Failed to delete murmur')
    } finally {
      setDeleteLoading(false)
      setShowDeleteModal(false)
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
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="py-12 text-center">Loading murmur…</div>
  }

  if (error || !murmur) {
    return (
      <div className="py-12 text-center">
        <div className="text-red-600 mb-4">{error || 'Murmur not found'}</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    )
  }

  const isOwnMurmur = currentUser?.id === murmur.author.id

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
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
        Back
      </button>

      {/* Murmur Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Author Info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {murmur.author.name}
            </h2>
            <p className="text-lg text-gray-600">@{murmur.author.username}</p>
          </div>
          {isOwnMurmur && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </div>

        {/* Murmur Text */}
        <div className="mb-6">
          <p className="text-xl text-gray-800 whitespace-pre-wrap leading-relaxed">
            {murmur.text}
          </p>
        </div>

        {/* Timestamp */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <p className="text-gray-500">{formatDate(murmur.createdAt)}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-200">
          <div>
            <span className="font-bold text-2xl text-gray-900">
              {murmur.likesCount}
            </span>
            <span className="text-gray-600 ml-2">Likes</span>
          </div>
        </div>

        {/* Actions */}
        <div>
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition disabled:opacity-50 ${
              murmur.isLiked
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill={murmur.isLiked ? 'currentColor' : 'none'}
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
            <span className="font-medium text-lg">
              {murmur.isLiked ? 'Unlike' : 'Like'}
            </span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-3">Delete Murmur</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this murmur? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMurmur}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
