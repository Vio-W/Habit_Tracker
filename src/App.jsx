import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import UpdateToast from './components/UpdateToast'

const HabitTracker = lazy(() => import('./pages/HabitTracker'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div style={{ padding: '1rem', textAlign: 'center' }}>Loading habits…</div>}>
                  <HabitTracker />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
        <UpdateToast />
      </BrowserRouter>
    </AuthProvider>
  )
}
