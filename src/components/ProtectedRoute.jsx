import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Don't decide anything until we know whether a session exists —
  // otherwise every refresh would flash the user to /login for a moment.
  if (loading) {
    return <p style={{ padding: '2rem' }}>Loading…</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
