import { useEffect, useRef, useState } from 'react'
import { validateAvatarFile, uploadAvatar, fetchAvatarUrl } from '../api/avatar'

export default function AvatarUploader({ userId }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  // Load whatever avatar is already saved, on mount.
  useEffect(() => {
    fetchAvatarUrl(userId)
      .then(setAvatarUrl)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  // Revoke the object URL when we're done with it — otherwise each
  // selected file leaks memory for the life of the page.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)

    if (!file) return

    const validationError = validateAvatarFile(file)
    if (validationError) {
      setError(validationError)
      e.target.value = '' // clear the input so the same bad file can be re-picked
      return
    }

    // Show the chosen image immediately, before any network request.
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const url = await uploadAvatar(userId, file)
      setAvatarUrl(url)
      setPreviewUrl(null)
      fileInputRef.current.value = ''
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const displayUrl = previewUrl ?? avatarUrl

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#eee',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {loading ? (
          <span style={{ fontSize: 12, color: '#999' }}>…</span>
        ) : displayUrl ? (
          <img
            src={displayUrl}
            alt="Avatar"
            loading="lazy"
            width={64}
            height={64}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: 12, color: '#999' }}>No photo</span>
        )}
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '0.5rem' }}>
            {uploading ? 'Uploading…' : 'Save avatar'}
          </button>
        )}
        {error && <p style={{ color: 'crimson', fontSize: 13, margin: '0.25rem 0 0' }}>{error}</p>}
      </div>
    </div>
  )
}