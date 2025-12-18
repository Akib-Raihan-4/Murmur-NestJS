import React from 'react'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  currentPage: 'users' | 'timeline' | 'profile'
  onNavigate: (page: 'users' | 'timeline' | 'profile') => void
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { logout, user } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <button
              onClick={() => onNavigate('users')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentPage === 'users'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => onNavigate('timeline')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentPage === 'timeline'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                currentPage === 'profile'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
