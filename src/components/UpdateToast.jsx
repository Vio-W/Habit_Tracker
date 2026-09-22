import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateToast() {
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swScriptUrl) {
      console.log('Service worker registered at', swScriptUrl)
    },
    onRegisterError(error) {
      console.error('Service worker registration failed', error)
    },
  })

  if (!offlineReady && !needRefresh) {
    return null
  }

  return (
    <div className="update-toast" role="status" aria-live="polite">
      {needRefresh && (
        <>
          <span>New version available</span>
          <button type="button" onClick={() => updateServiceWorker(true)}>
            Refresh
          </button>
        </>
      )}
      {!needRefresh && offlineReady && <span>App ready for offline use</span>}
    </div>
  )
}
