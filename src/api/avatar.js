import { supabase } from '../lib/supabase'

export const MAX_AVATAR_BYTES = 1024 * 1024 // 1 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

// Pure function — no side effects, easy to unit test, and reusable
// wherever else file input might show up later.
export function validateAvatarFile(file) {
  if (!file) return 'No file selected.'

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Please choose an image file (PNG, JPEG, WebP, or GIF).'
  }

  if (file.size > MAX_AVATAR_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `That file is ${mb} MB — please choose one under 1 MB.`
  }

  return null // null = valid
}

// Uploads to avatars/{userId}/avatar.{ext}, always the SAME filename
// per user, so upsert:true overwrites in place instead of piling up
// duplicate files every time someone re-uploads.
export async function uploadAvatar(userId, file) {
  const validationError = validateAvatarFile(file)
  if (validationError) throw new Error(validationError)

  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Cache-bust so the browser doesn't keep showing the old cached image
  // at the same URL after an upsert replaces the file.
  const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: userId, avatar_url: publicUrl, updated_at: new Date().toISOString() })

  if (profileError) throw profileError

  return publicUrl
}

export async function fetchAvatarUrl(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.avatar_url ?? null
}