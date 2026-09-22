import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  fetchHabits,
  addHabit,
  updateHabit,
  toggleHabit,
  deleteHabit,
} from '../api/habits'

export default function HabitTracker() {
  const { user, signOut } = useAuth()

  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

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

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setError(null)
    try {
      const habit = await addHabit(user.id, {
        name: newName.trim(),
        description: newDescription.trim() || null,
      })
      setHabits((prev) => [habit, ...prev])
      setNewName('')
      setNewDescription('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  function startEdit(habit) {
    setEditingId(habit.id)
    setEditName(habit.name)
    setEditDescription(habit.description ?? '')
  }

  async function saveEdit(habitId) {
    setError(null)
    try {
      const updated = await updateHabit(user.id, habitId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      })
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updated : h)))
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggle(habit) {
    setError(null)
    try {
      const updated = await toggleHabit(user.id, habit.id, !habit.is_active)
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(habitId) {
    if (!confirm('Delete this habit? Its logs will be deleted too.')) return
    setError(null)
    try {
      await deleteHabit(user.id, habitId)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Habits</h1>
        <button onClick={signOut}>Sign out</button>
      </header>
      <p style={{ color: '#666' }}>{user.email}</p>

      <form onSubmit={handleAdd} style={{ display: 'grid', gap: '0.5rem', margin: '1.5rem 0' }}>
        <input
          placeholder="New habit name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding…' : 'Add habit'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {loading ? (
        <p>Loading habits…</p>
      ) : habits.length === 0 ? (
        <p>No habits yet — add your first one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
          {habits.map((habit) => (
            <li
              key={habit.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                opacity: habit.is_active ? 1 : 0.5,
              }}
            >
              {editingId === habit.id ? (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => saveEdit(habit.id)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{habit.name}</strong>
                    {habit.description && <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{habit.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleToggle(habit)}>
                      {habit.is_active ? 'Active' : 'Paused'}
                    </button>
                    <button onClick={() => startEdit(habit)}>Edit</button>
                    <button onClick={() => handleDelete(habit.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
