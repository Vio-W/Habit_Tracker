import { supabase } from '../lib/supabase'

// List every habit belonging to userId, newest first.
// Explicit .eq('user_id', ...) here is belt-and-suspenders: RLS already
// blocks other users' rows at the database, but scoping the query too
// means we never even ask for data we shouldn't see.
export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addHabit(userId, { name, description }) {
  const { data, error } = await supabase
    .from('habits')
    .insert({ user_id: userId, name, description })
    .select()
    .single()

  if (error) throw error
  return data
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
