import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import HabitTracker from './pages/HabitTracker'
import UpdateToast from './components/UpdateToast'

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
                <HabitTracker />
              </ProtectedRoute>
            }
          />
        </Routes>
        <UpdateToast />
      </BrowserRouter>
    </AuthProvider>
  )
}
