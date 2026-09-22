import { supabase } from '../lib/supabase'
import { addQueuedHabit, getQueuedHabitsForUser, removeQueuedHabit } from '../lib/offlineQueue'

// List every habit belonging to userId, newest first.
export async function fetchHabits(userId) {
  const queued = getQueuedHabitsForUser(userId)
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  const dbHabits = data ?? []
  const queuedMap = new Map(queued.map((habit) => [habit.id, habit]))

  return [...dbHabits, ...queued.filter((habit) => !dbHabits.some((entry) => entry.id === habit.id))]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((habit) => queuedMap.get(habit.id) ?? habit)
}

export async function addHabit(userId, { name, description }) {
  if (!navigator.onLine) {
    const queued = addQueuedHabit(userId, {
      id: `queued-${Date.now()}`,
      name,
      description,
      is_active: true,
      created_at: new Date().toISOString(),
    })
    return queued
  }

  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, name, description })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function syncQueuedHabits(userId) {
  const queued = getQueuedHabitsForUser(userId)

  for (const habit of queued) {
    const { error } = await supabase
      .from('habits')
      .insert({ user_id: userId, name: habit.name, description: habit.description, is_active: habit.is_active })

    if (!error) removeQueuedHabit(habit.id)
  }
}

// updates is a partial object, e.g. { name: 'New name' } or { is_active: false }
export async function updateHabit(userId, habitId, updates) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .eq('user_id', userId) // can only ever touch a row you own
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleHabit(userId, habitId, isActive) {
  return updateHabit(userId, habitId, { is_active: isActive })
}

// Deleting the habit also deletes its daily_logs rows automatically —
// see "on delete cascade" on daily_logs.habit_id in sql/schema.sql.
export async function deleteHabit(userId, habitId) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId)

  if (error) throw error
}
