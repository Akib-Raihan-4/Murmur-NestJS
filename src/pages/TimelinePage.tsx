import React, { useState } from 'react'
import { useTimeline } from '../hooks/useTimeline'
import { murmurService } from '../services/api'
import { IMurmur } from '../interfaces/murmur.interfaces'
import { useAuth } from '../contexts/AuthContext'
import { MurmurDetailPage } from './MurmurDetailPage'

export const TimelinePage: React.FC = () => {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMurmurId, setSelectedMurmurId] = useState<number | null>(null)

  const {
    murmurs,
    pagination,
    isInitialLoading,
    isFetching,
    error,
    setMurmurs,
    refetch,
  } = useTimeline(currentPage)

  const [likeLoading, setLikeLoading] = useState<number | null>(null)
  const [murmurText, setMurmurText] = useState('')
  const [postLoading, setPostLoading] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  if (selectedMurmurId) {
    return (
      <MurmurDetailPage
        murmurId={selectedMurmurId}
        onBack={() => {
          setSelectedMurmurId(null)
          refetch()
        }}
      />
    )
  }

  const handleToggleLike = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    setLikeLoading(id)

    setMurmurs((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              isLiked: !m.isLiked,
              likesCount: m.isLiked ? m.likesCount - 1 : m.likesCount + 1,
            }
          : m,
      ),
    )

    try {
      await murmurService.toggleLike(id)
    } catch (err) {
      console.error(err)
      refetch()
    } finally {
      setLikeLoading(null)
    }
  }

  const handlePostMurmur = async () => {
    if (!murmurText.trim()) {
      setPostError('Please enter some text')
      return
    }

    setPostLoading(true)
    setPostError(null)

    const tempMurmur: IMurmur = {
      id: Date.now(),
      text: murmurText,
      isLiked: false,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      author: {
        name: user?.name || 'You',
        username: user?.username || 'you',
      },
    } as IMurmur

    setMurmurs((prev) => [tempMurmur, ...prev])
    setMurmurText('')

    try {
      await murmurService.createMurmur({ text: tempMurmur.text })
      refetch()
    } catch (err: any) {
      setPostError(err.response?.data?.message || 'Failed to post murmur')
      refetch()
    } finally {
      setPostLoading(false)
    }
  }

  const handleDeleteMurmur = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()

    setDeleteLoading(id)
    try {
      await murmurService.deleteMurmur(id)
      refetch()
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

  if (isInitialLoading) {
    return (
      <div className="flex justify-center py-12 text-xl text-gray-600">
        Loading timeline…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center py-12 text-xl text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Timeline</h1>

      {isFetching && (
        <div className="text-sm text-gray-500 mb-2">Updating…</div>
      )}

      {/* Create Murmur */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <textarea
          value={murmurText}
          onChange={(e) => setMurmurText(e.target.value)}
          rows={3}
          placeholder="What's on your mind?"
          className="w-full border rounded-lg p-3 resize-none"
        />
        {postError && <p className="text-sm text-red-500 mt-2">{postError}</p>}
        <div className="flex justify-between mt-3">
          <span className="text-sm text-gray-500">
            {murmurText.length} characters
          </span>
          <button
            onClick={handlePostMurmur}
            disabled={postLoading || !murmurText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {postLoading ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {murmurs.map((m) => {
          const isOwnMurmur = m.author.username === user?.username
          return (
            <div
              key={m.id}
              className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedMurmurId(m.id)}
            >
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
                  {isOwnMurmur && (
                    <button
                      onClick={(e) => handleDeleteMurmur(m.id, e)}
                      disabled={deleteLoading === m.id}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      {deleteLoading === m.id ? 'Deleting…' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>

              <p className="mb-4 whitespace-pre-wrap">{m.text}</p>

              <button
                onClick={(e) => handleToggleLike(m.id, e)}
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
                <span className="font-medium">
                  {likeLoading === m.id ? '…' : m.likesCount}
                </span>
              </button>
            </div>
          )
        })}
      </div>

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
    </div>
  )
}
