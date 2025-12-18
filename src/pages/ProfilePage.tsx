import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../hooks/useProfile'

export const ProfilePage: React.FC = () => {
  const { token, logout } = useAuth()
  const { profile, loading, error } = useProfile(token)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-semibold text-gray-800">
                {profile?.username}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {profile?.name}
              </p>
            </div>

            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-lg font-semibold text-gray-800">
                {profile?.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {profile?.followersCount || 0}
                </p>
                <p className="text-sm text-gray-600">Followers</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {profile?.followingCount || 0}
                </p>
                <p className="text-sm text-gray-600">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
