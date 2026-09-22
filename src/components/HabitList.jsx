import { useState } from 'react'
import { addHabit, updateHabit, toggleHabit, deleteHabit } from '../api/habits'

// Set this to true temporarily (or throw conditionally) to prove the
// ErrorBoundary around this component catches it without taking down
// Nav or Stats. Revert before committing.
const DEBUG_FORCE_CRASH = false

export default function HabitList({ userId, habits, setHabits }) {
  if (DEBUG_FORCE_CRASH) {
    throw new Error('Debug crash: forced failure in HabitList')
  }

  const [error, setError] = useState(null)

  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [shareState, setShareState] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setError(null)
    try {
      const habit = await addHabit(userId, {
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
      const updated = await updateHabit(userId, habitId, {
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
      const updated = await toggleHabit(userId, habit.id, !habit.is_active)
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? updated : h)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(habitId) {
    if (!confirm('Delete this habit? Its logs will be deleted too.')) return
    setError(null)
    try {
      await deleteHabit(userId, habitId)
      setHabits((prev) => prev.filter((h) => h.id !== habitId))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleShare() {
    const shareText = habits
      .filter((habit) => habit.is_active)
      .map((habit) => `• ${habit.name}${habit.description ? ` — ${habit.description}` : ''}`)
      .join('\n') || 'No active habits yet.'

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Habit Tracker', text: shareText })
        setShareState('Shared')
        return
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)
        setShareState('Copied to clipboard')
        return
      }

      setShareState('Share unavailable on this device')
    } catch {
      setShareState('Share cancelled')
    }
  }

  return (
    <div>
      <div className="app-toolbar">
        <button type="button" className="btn-secondary" onClick={handleShare}>
          Share
        </button>
        {shareState && <span className="share-status">{shareState}</span>}
      </div>

      <form onSubmit={handleAdd} className="habit-form">
        <input
          aria-label="New habit name"
          placeholder="New habit name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          aria-label="Habit description"
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={adding}>
          {adding ? 'Adding…' : 'Add habit'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {habits.length === 0 ? (
        <p>No habits yet — add your first one above.</p>
      ) : (
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className={`habit-item ${habit.is_active ? '' : 'paused'}`}>
              {editingId === habit.id ? (
                <div className="habit-edit-form">
                  <input aria-label="Edit habit name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input aria-label="Edit habit description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  <div className="habit-actions">
                    <button onClick={() => saveEdit(habit.id)} className="btn-primary">Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="habit-card">
                  <div className="habit-copy">
                    <strong>{habit.name}</strong>
                    {habit.description && <p>{habit.description}</p>}
                  </div>
                  <div className="habit-actions">
                    <button onClick={() => handleToggle(habit)} className="btn-secondary">
                      {habit.is_active ? 'Active' : 'Paused'}
                    </button>
                    <button onClick={() => startEdit(habit)} className="btn-secondary">Edit</button>
                    <button onClick={() => handleDelete(habit.id)} className="btn-secondary">Delete</button>
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