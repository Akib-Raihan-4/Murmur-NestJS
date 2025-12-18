import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Navbar } from './components/Navbar'
import { SignUpPage } from './pages/SignUpPage'
import { SignInPage } from './pages/SignInPage'
import { UsersPage } from './pages/UsersPage'
import { TimelinePage } from './pages/TimelinePage'
import { ProfilePage } from './pages/ProfilePage'

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [showSignUp, setShowSignUp] = useState(true)
  const [currentPage, setCurrentPage] = useState<
    'users' | 'timeline' | 'profile'
  >('users')

  if (!isAuthenticated) {
    return showSignUp ? (
      <SignUpPage onSwitchToSignIn={() => setShowSignUp(false)} />
    ) : (
      <SignInPage onSwitchToSignUp={() => setShowSignUp(true)} />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="py-6">
        {currentPage === 'users' && <UsersPage />}
        {currentPage === 'timeline' && <TimelinePage />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
