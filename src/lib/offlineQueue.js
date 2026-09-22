const STORAGE_KEY = 'habit-tracker:queued-habits'

export function readQueuedHabits() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeQueuedHabits(queue) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function getQueuedHabitsForUser(userId) {
  return readQueuedHabits().filter((habit) => habit.user_id === userId)
}

export function addQueuedHabit(userId, habit) {
  const queue = readQueuedHabits()
  const item = {
    ...habit,
    id: habit.id ?? `queued-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user_id: userId,
    queued: true,
    created_at: habit.created_at ?? new Date().toISOString(),
  }

  const nextQueue = [item, ...queue.filter((entry) => entry.id !== item.id)]
  writeQueuedHabits(nextQueue)
  return item
}

export function removeQueuedHabit(queuedId) {
  const nextQueue = readQueuedHabits().filter((habit) => habit.id !== queuedId)
  writeQueuedHabits(nextQueue)
}
