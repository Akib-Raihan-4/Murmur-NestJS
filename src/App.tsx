import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { SignUpPage } from './pages/SignUpPage'
import { SignInPage } from './pages/SignInPage'
import { ProfilePage } from './pages/ProfilePage'

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [showSignUp, setShowSignUp] = useState(true)

  if (isAuthenticated) {
    return <ProfilePage />
  }

  return showSignUp ? (
    <SignUpPage onSwitchToSignIn={() => setShowSignUp(false)} />
  ) : (
    <SignInPage onSwitchToSignUp={() => setShowSignUp(true)} />
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
