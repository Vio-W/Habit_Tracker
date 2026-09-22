import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchHabits } from '../api/habits'
import ErrorBoundary from '../components/ErrorBoundary'
import Nav from '../components/Nav'
import Stats from '../components/Stats'
import HabitList from '../components/HabitList'

export default function HabitTracker() {
  const { user } = useAuth()

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadHabits()
  }, [])

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
    <div style={{ maxWidth: 560, margin: '2rem auto', fontFamily: 'sans-serif' }}>
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