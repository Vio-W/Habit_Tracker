import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchHabits, syncQueuedHabits } from '../api/habits'
import ErrorBoundary from '../components/ErrorBoundary'
import Nav from '../components/Nav'
import Stats from '../components/Stats'
import HabitList from '../components/HabitList'
import { readQueuedHabits } from '../lib/offlineQueue'

export default function HabitTracker() {
  const { user } = useAuth()

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [pendingSyncCount, setPendingSyncCount] = useState(0)

  useEffect(() => {
    loadHabits()
  }, [])

  useEffect(() => {
    if (!user?.id) return

    const handleOnline = () => {
      setIsOnline(true)
      syncQueuedHabits(user.id).finally(() => loadHabits())
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [user])

  useEffect(() => {
    if (!user?.id) return
    setPendingSyncCount(readQueuedHabits().filter((habit) => habit.user_id === user.id).length)
  }, [habits, user])

  async function loadHabits() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchHabits(user.id)
      setHabits(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      {!isOnline && (
        <div className="offline-banner" role="status" aria-live="polite">
          Offline mode: your next habit is queued and will sync when you reconnect.
        </div>
      )}

      {pendingSyncCount > 0 && isOnline && (
        <div className="sync-banner" role="status" aria-live="polite">
          {pendingSyncCount} queued habit{pendingSyncCount > 1 ? 's' : ''} syncing now.
        </div>
      )}

      <ErrorBoundary label="Nav">
        <Nav />
      </ErrorBoundary>

      <ErrorBoundary label="Stats">
        <Stats habits={habits} />
      </ErrorBoundary>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ErrorBoundary label="Habit list">
        {loading ? (
          <p>Loading habits…</p>
        ) : (
          <HabitList userId={user.id} habits={habits} setHabits={setHabits} />
        )}
      </ErrorBoundary>
    </div>
  )
}